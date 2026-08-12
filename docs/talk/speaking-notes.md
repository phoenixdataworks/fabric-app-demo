# Speaking notes (60 min)

**Repos to share:** this demo + [microsoft/skills-for-fabric](https://github.com/microsoft/skills-for-fabric)

| Time | Say | Show |
|------|-----|------|
| 0–5 | Who I am. Reports hit limits with custom interaction / write-back / embedded logic. | Title + README |
| 5–15 | Fabric Data Apps + Rayfin. When they beat a classic report. | `docs/CONCEPTS.md` §1–3, `rayfin/data/` |
| 15–30 | Cursor: rules, one skill, schema Markdown. Then official skills-for-fabric. | `.cursor/rules/`, skill, `schema/`, `npm run skills:install`, add folder to workspace, `docs/skills-for-fabric.md` |
| 30–50 | Live: add backlog-by-risk from schema. Hard stop 15–18 min coding. | `docs/talk/live-demo.md` |
| 50–60 | Takeaways. Preview limits. Q&A. | Below |

## skills-for-fabric beat (inside 15–30)

1. `npm run skills:install` — clones to `../skills-for-fabric`
2. Cursor: Add Folder to Workspace
3. Open `.cursorrules` — breadth of platform coverage
4. Open one skill under `skills/` (e.g. semantic-model-authoring)
5. Open `agents/FabricAppDev.agent.md` — Python/ODBC, not Rayfin
6. Open this repo's `modify-fabric-data-app` — why we wrote one skill

**Fallback:** if install fails, show the GitHub repo in browser; talk still works.

## Live demo fallback

If Cursor or network fails, paste from `docs/talk/live-demo.md`. Do not debug live past two minutes.

## Takeaways

1. Data Apps (Rayfin) = code-first UX on semantic models.
2. Schema Markdown + short rules make Cursor reliable.
3. Skills = procedures; rules = invariants.
4. Use [skills-for-fabric](https://github.com/microsoft/skills-for-fabric) for the platform; use this repo's skill for the Data App.
5. One tested rule set + one skill beats a large untested collection.
