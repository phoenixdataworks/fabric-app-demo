# Speaking notes (60 min)

**Full agenda:** [agenda.md](agenda.md)

**Repo to share:** this demo. Official Fabric skills install via CLI (see below).

| Time | Say | Show |
|------|-----|------|
| 0–5 | Who I am. Reports hit limits with custom interaction / write-back / embedded logic. | Title + README |
| 5–15 | Fabric Data Apps. Warehouse → semantic model → DAX → React. Read-only demo. | `docs/GETTING_STARTED.md`, `docs/CONCEPTS.md` |
| 15–30 | Cursor: rules, one skill, schema Markdown. Official skills-for-fabric. | `.cursor/rules/`, skill, `schema/`, `npx skills add ...` |
| 30–50 | Live: add backlog-by-risk via DAX. Hard stop 15–18 min coding. | `docs/talk/live-demo.md`, Fabric portal embed |
| 50–60 | Takeaways. Preview limits. Q&A. | Below |

## Before the talk

Attendees (or you) should have:

1. Demo DW loaded (`npm run warehouse:sql -- --demo` + run SQL in the portal)
2. Schema scraped from Demo DW (`npm run schema:scrape` — see `schema/README.md`)
3. Semantic model from warehouse **Reporting** tab
4. Fabric App item + `.env.fabric` with publishable key
5. App open with `?fabricEmbedded=true&devUri=http://localhost:5173`

See **GETTING_STARTED.md** for the full checklist.

## skills-for-fabric beat (inside 15–30)

1. `npx skills add microsoft/skills-for-fabric -a cursor -g -y`
2. `npx skills list -g` — show installed Fabric skills
3. Open one global skill (e.g. `~/.agents/skills/semantic-model-authoring/SKILL.md`)
4. Open this repo's `modify-fabric-data-app` — why we wrote one project skill
5. Mention scope: `-g` global vs project (commit team skills)

**Fallback:** if install fails, show [microsoft/skills-for-fabric](https://github.com/microsoft/skills-for-fabric) in browser; talk still works.

## Live demo fallback

If Cursor or network fails, paste from `docs/talk/live-demo.md`. Do not debug live past two minutes.

## Takeaways

1. Data Apps = code-first read-only UX on **live semantic models** (warehouse → model → DAX).
2. Schema Markdown + short rules make Cursor reliable.
3. Skills = procedures; rules = invariants.
4. Use [skills-for-fabric](https://github.com/microsoft/skills-for-fabric) for the platform; use this repo's skill for the Data App layer.
5. One tested rule set + one skill beats a large untested collection.
