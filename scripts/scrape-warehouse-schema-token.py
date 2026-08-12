#!/usr/bin/env python3
"""Scrape Fabric Warehouse schema using an Azure CLI access token (no browser popup)."""

from __future__ import annotations

import os
import re
import shutil
import struct
import subprocess
import sys
from pathlib import Path

import pyodbc

from schema_scraper.backends.mssql.connection import MSSQLConnection
from schema_scraper.base.models import Database
from schema_scraper.config import ScraperConfig
from schema_scraper.exceptions import ConnectionError
from schema_scraper.generators import MarkdownGenerator

SQL_COPT_SS_ACCESS_TOKEN = 1256
TOKEN_RESOURCES = (
    "https://database.windows.net/",
    "https://database.usgovcloudapi.net/",
)


def repo_root() -> Path:
    return Path(__file__).resolve().parents[1]


def load_env_file(path: Path) -> dict[str, str]:
    values: dict[str, str] = {}
    if not path.is_file():
        return values

    for raw_line in path.read_text(encoding="utf-8").splitlines():
        line = raw_line.strip()
        if not line or line.startswith("#"):
            continue
        key, _, value = line.partition("=")
        values[key.strip()] = value.strip().strip('"').strip("'")
    return values


def require_env(env: dict[str, str], key: str) -> str:
    value = env.get(key) or os.environ.get(key)
    if not value:
        raise SystemExit(f"Missing {key} in .env.warehouse")
    return value


def get_az_access_token(tenant_id: str | None = None) -> str:
    last_error = ""
    for resource in TOKEN_RESOURCES:
        try:
            cmd = [
                "az",
                "account",
                "get-access-token",
                "--resource",
                resource,
                "--query",
                "accessToken",
                "-o",
                "tsv",
            ]
            if tenant_id:
                cmd.extend(["--tenant", tenant_id])
            result = subprocess.run(
                cmd,
                capture_output=True,
                text=True,
                check=True,
            )
            token = result.stdout.strip()
            if token:
                print(f"Got Azure access token for {resource}")
                return token
        except subprocess.CalledProcessError as exc:
            last_error = (exc.stderr or exc.stdout or str(exc)).strip()

    tenant_hint = tenant_id or "<fabric-tenant-id>"
    raise SystemExit(
        "Could not get an Azure access token.\n"
        "Fabric often has no Azure subscription. Log in with:\n"
        f"  az login --tenant {tenant_hint} --allow-no-subscriptions\n"
        "Then retry: npm run schema:scrape\n"
        f"Last error: {last_error}"
    )


class TokenMSSQLConnection(MSSQLConnection):
    """MS SQL connection that uses a pre-fetched Azure AD access token."""

    def __init__(self, config: ScraperConfig, access_token: str) -> None:
        super().__init__(config)
        self.access_token = access_token

    def connect(self) -> None:
        if not self.config.host or not self.config.database:
            raise ConnectionError("Host and database are required")

        driver = self.config.driver or self._detect_driver()
        server = self.config.host
        if self.config.port and self.config.port != 1433:
            server = f"{server},{self.config.port}"

        conn_str = (
            f"Driver={{{driver}}};"
            f"Server=tcp:{server};"
            f"Database={self.config.database};"
            f"Encrypt=yes;TrustServerCertificate=yes;"
        )

        token_bytes = self.access_token.encode("utf-16-le")
        token_struct = struct.pack(f"<I{len(token_bytes)}s", len(token_bytes), token_bytes)

        try:
            self._connection = pyodbc.connect(
                conn_str,
                attrs_before={SQL_COPT_SS_ACCESS_TOKEN: token_struct},
                timeout=30,
            )
        except pyodbc.Error as exc:
            raise ConnectionError(f"Failed to connect to database: {exc}") from exc


def sanitize_db_name(database: str) -> str:
    return re.sub(r"[^a-zA-Z0-9_-]", "_", database)


def copy_table_docs(staging_dir: Path, database: str, schema_out: Path) -> int:
    tables_dir = staging_dir / sanitize_db_name(database) / "tables"
    if not tables_dir.is_dir():
        raise SystemExit(f"Expected scraped tables at: {tables_dir}")

    copied = 0
    for src in sorted(tables_dir.glob("*.md")):
        if src.name == "README.md":
            continue
        dest = schema_out / src.name.removeprefix("dbo.")
        shutil.copy2(src, dest)
        copied += 1
        print(f"  -> schema/tables/{dest.name}")

    if copied == 0:
        raise SystemExit(f"No table markdown files were copied from {tables_dir}")
    return copied


def enrich_table_row_counts(conn: MSSQLConnection, tables) -> None:
    """Fabric Warehouse columnstore tables often report 0 rows via sys.partitions."""
    # Avoid snapshot-isolation errors after metadata extraction (Fabric error 3961).
    conn.connection.autocommit = True

    for table in tables:
        qualified = f"[{table.schema_name}].[{table.name}]"
        try:
            count = conn.execute_scalar(f"SELECT COUNT(*) FROM {qualified}")
            table.row_count = int(count or 0)
            print(f"  {table.full_name}: {table.row_count:,} rows")
        except pyodbc.Error as exc:
            print(f"  {table.full_name}: row count unavailable ({exc})")


def main() -> None:
    root = repo_root()
    env_path = Path(os.environ.get("WAREHOUSE_ENV_FILE", root / ".env.warehouse"))
    env = load_env_file(env_path)

    host = require_env(env, "DB_HOST")
    database = require_env(env, "DB_NAME")
    port = int(env.get("DB_PORT") or os.environ.get("DB_PORT") or "1433")
    tenant_id = env.get("DB_TENANT") or os.environ.get("DB_TENANT")

    staging_dir = root / "warehouse" / ".schema-scrape-staging"
    schema_out = root / "schema" / "tables"
    schema_out.mkdir(parents=True, exist_ok=True)

    if staging_dir.exists():
        shutil.rmtree(staging_dir)
    staging_dir.mkdir(parents=True)

    config = ScraperConfig(
        db_type="mssql",
        host=host,
        port=port,
        database=database,
        username="token",
        password="token",
        output_dir=staging_dir / sanitize_db_name(database),
        include_schemas=["dbo"],
        object_types=["tables"],
    )

    token = get_az_access_token(tenant_id)
    print(f"Connecting to {host} / {database}")

    with TokenMSSQLConnection(config, token) as conn:
        version = conn.get_version() if hasattr(conn, "get_version") else "Unknown"
        print(f"Connected. Server version: {version.splitlines()[0]}")

        from schema_scraper.backends.mssql import get_extractors

        db = Database(name=database, db_type="mssql", server=host)
        db.version = version

        extractors = get_extractors()
        extractor = extractors["tables"](conn, config)
        tables = extractor.extract()
        enrich_table_row_counts(conn, tables)
        db.tables = tables
        print(f"Found {len(tables)} tables")

    print("Generating markdown documentation...")
    generator = MarkdownGenerator(config)
    generator.generate(db)

    copied = copy_table_docs(staging_dir, database, schema_out)
    print(f"\nCopied {copied} table docs to schema/tables/")


if __name__ == "__main__":
    main()
