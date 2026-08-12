#!/usr/bin/env bash
set -euo pipefail

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
TARGET="${SKILLS_FOR_FABRIC_DIR:-$(dirname "$REPO_ROOT")/skills-for-fabric}"
URL="https://github.com/microsoft/skills-for-fabric.git"

if [ -d "$TARGET/.git" ]; then
  echo "skills-for-fabric already installed at: $TARGET"
  echo "Updating..."
  git -C "$TARGET" pull --ff-only
else
  echo "Cloning skills-for-fabric to: $TARGET"
  git clone --depth 1 "$URL" "$TARGET"
fi

echo ""
echo "Installed. Cursor picks up:"
echo "  - $TARGET/.cursorrules"
echo "  - $TARGET/AGENTS.md"
echo "  - $TARGET/skills/*/SKILL.md"
echo ""
echo "To show in the talk:"
echo "  1. Open this demo repo in Cursor (fabric-app-demo)"
echo "  2. File → Add Folder to Workspace → $TARGET"
echo "  3. Ask Cursor about warehouse, semantic model, or PBIP work — official skills apply"
echo "  4. Ask about Migration Pulse changes — use modify-fabric-data-app in this repo"
