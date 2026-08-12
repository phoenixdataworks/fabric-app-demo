#!/usr/bin/env bash
set -euo pipefail

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$REPO_ROOT"

SCOPE_ARGS=()
if [[ "${SKILLS_GLOBAL:-1}" == "1" || "${SKILLS_GLOBAL:-1}" == "true" ]]; then
  SCOPE_ARGS=(-g)
fi

SKILL_ARGS=()
if [[ -n "${SKILLS_FILTER:-}" ]]; then
  SKILL_ARGS=(--skill "$SKILLS_FILTER")
fi

echo "Installing microsoft/skills-for-fabric for Cursor..."
npx --yes skills add microsoft/skills-for-fabric -a cursor "${SCOPE_ARGS[@]}" "${SKILL_ARGS[@]}" -y

echo ""
if ((${#SCOPE_ARGS[@]})); then
  echo "Scope: global (~/.agents/skills/ or ~/.cursor/skills/)"
  echo "Verify: npx skills list -g"
else
  echo "Scope: project (.agents/skills/ or .cursor/skills/)"
  echo "Verify: npx skills list"
fi
echo ""
echo "Restart the Cursor agent session or open a new chat for skills to load."
echo "Migration Pulse UI changes still use .cursor/skills/modify-fabric-data-app/ in this repo."
