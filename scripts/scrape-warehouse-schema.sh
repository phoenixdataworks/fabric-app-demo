#!/usr/bin/env bash
# Scrape Fabric Warehouse metadata into schema/ using schema-scraper.
# Install: pip install "schema-scraper[mssql]"  (https://pypi.org/project/schema-scraper/)
set -euo pipefail

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
SCHEMA_SCRAPER_DIR="${SCHEMA_SCRAPER_DIR:-$(dirname "$REPO_ROOT")/schema_scraper}"
ENV_FILE="${WAREHOUSE_ENV_FILE:-$REPO_ROOT/.env.warehouse}"
STAGING_DIR="$REPO_ROOT/warehouse/.schema-scrape-staging"
SCHEMA_OUT="$REPO_ROOT/schema/tables"

resolve_schema_scraper_bin() {
  if [[ -n "${SCHEMA_SCRAPER_BIN:-}" && -x "$SCHEMA_SCRAPER_BIN" ]]; then
    return 0
  fi
  if command -v schema-scraper >/dev/null 2>&1; then
    SCHEMA_SCRAPER_BIN="$(command -v schema-scraper)"
    return 0
  fi
  local fallback="$SCHEMA_SCRAPER_DIR/.venv/bin/schema-scraper"
  if [[ -x "$fallback" ]]; then
    SCHEMA_SCRAPER_BIN="$fallback"
    return 0
  fi
  return 1
}

resolve_schema_scraper_python() {
  if [[ -n "${SCHEMA_SCRAPER_PYTHON:-}" && -x "$SCHEMA_SCRAPER_PYTHON" ]]; then
    return 0
  fi
  if python3 -c "import schema_scraper" 2>/dev/null; then
    SCHEMA_SCRAPER_PYTHON="$(python3 -c 'import sys; print(sys.executable)')"
    return 0
  fi
  local fallback="$SCHEMA_SCRAPER_DIR/.venv/bin/python"
  if [[ -x "$fallback" ]] && "$fallback" -c "import schema_scraper" 2>/dev/null; then
    SCHEMA_SCRAPER_PYTHON="$fallback"
    return 0
  fi
  return 1
}

if ! resolve_schema_scraper_bin; then
  echo "schema-scraper not found on PATH." >&2
  echo "" >&2
  echo "Install from PyPI:" >&2
  echo '  pip install "schema-scraper[mssql]"' >&2
  echo "" >&2
  echo "Docs: https://pypi.org/project/schema-scraper/" >&2
  echo "" >&2
  echo "Or set SCHEMA_SCRAPER_BIN to a local checkout venv binary." >&2
  exit 1
fi

if [[ -f "$ENV_FILE" ]]; then
  # shellcheck disable=SC1090
  set -a
  source "$ENV_FILE"
  set +a
fi

: "${DB_NAME:?Set DB_NAME (warehouse database name) in .env.warehouse — use the Database value from the Fabric SQL endpoint dialog.}"

DB_AUTH="${DB_AUTH:-ActiveDirectoryCli}"

echo "Using schema-scraper: $SCHEMA_SCRAPER_BIN"
echo "Warehouse database: $DB_NAME"
echo "Auth mode: $DB_AUTH"

if [[ "$DB_AUTH" == "ActiveDirectoryCli" || "$DB_AUTH" == "ActiveDirectoryAccessToken" ]]; then
  if ! resolve_schema_scraper_python; then
    echo "Python with schema_scraper package not found." >&2
    echo 'Install: pip install "schema-scraper[mssql]"' >&2
    exit 1
  fi
  echo "Using Azure CLI token auth (no browser popup)."
  echo "If this fails, run: az login"
  WAREHOUSE_ENV_FILE="$ENV_FILE" "$SCHEMA_SCRAPER_PYTHON" "$REPO_ROOT/scripts/scrape-warehouse-schema-token.py"
  exit 0
fi

DB_AUTH="${DB_AUTH:-ActiveDirectoryInteractive}"

if [[ -z "${DB_CONNECTION_STRING:-}" && -n "${DB_HOST:-}" ]]; then
  DB_CONNECTION_STRING="Driver={ODBC Driver 18 for SQL Server};Server=tcp:${DB_HOST},${DB_PORT:-1433};Database=${DB_NAME};Encrypt=yes;TrustServerCertificate=no;Authentication=${DB_AUTH}"
fi

SCRAPE_ARGS=(
  scrape
  -t mssql
  -d "$DB_NAME"
  -o "$STAGING_DIR"
  --schemas dbo
  --object-types tables
)

if [[ -n "${DB_CONNECTION_STRING:-}" ]]; then
  SCRAPE_ARGS+=(-c "$DB_CONNECTION_STRING")
elif [[ -n "${DB_HOST:-}" ]]; then
  SCRAPE_ARGS+=(-h "$DB_HOST")
  if [[ -n "${DB_PORT:-}" ]]; then
    SCRAPE_ARGS+=(-P "$DB_PORT")
  fi
  if [[ "${DB_TRUSTED:-}" == "1" ]]; then
    SCRAPE_ARGS+=(--trusted)
  else
    : "${DB_USER:?Set DB_USER, DB_CONNECTION_STRING, or DB_AUTH for Azure AD}"
    : "${DB_PASSWORD:?Set DB_PASSWORD or DB_CONNECTION_STRING}"
    SCRAPE_ARGS+=(-u "$DB_USER" -p "$DB_PASSWORD")
  fi
else
  echo "Set DB_HOST or DB_CONNECTION_STRING in $ENV_FILE" >&2
  exit 1
fi

if [[ -n "${DB_DRIVER:-}" ]]; then
  SCRAPE_ARGS+=(--driver "$DB_DRIVER")
fi

echo "Staging output: $STAGING_DIR"
echo "Note: ActiveDirectoryInteractive often fails in Cursor's terminal. Use DB_AUTH=ActiveDirectoryCli instead."

rm -rf "$STAGING_DIR"
mkdir -p "$STAGING_DIR" "$SCHEMA_OUT"

"$SCHEMA_SCRAPER_BIN" "${SCRAPE_ARGS[@]}" "$@"

DB_NAME_SAFE="$(printf '%s' "$DB_NAME" | tr -c '[:alnum:]-_' '_')"
TABLES_DIR="$STAGING_DIR/$DB_NAME_SAFE/tables"

if [[ ! -d "$TABLES_DIR" ]]; then
  echo "Expected scraped tables at: $TABLES_DIR" >&2
  exit 1
fi

shopt -s nullglob
copied=0
for src in "$TABLES_DIR"/*.md; do
  base="$(basename "$src")"
  if [[ "$base" == "README.md" ]]; then
    continue
  fi
  dest="$SCHEMA_OUT/${base#dbo.}"
  cp "$src" "$dest"
  copied=$((copied + 1))
  echo "  -> schema/tables/$(basename "$dest")"
done
shopt -u nullglob

if [[ "$copied" -eq 0 ]]; then
  echo "No table markdown files were copied from $TABLES_DIR" >&2
  exit 1
fi

echo ""
echo "Copied $copied table docs to schema/tables/"
echo "Review diffs before commit. App field mapping notes may need to be re-added by hand."
