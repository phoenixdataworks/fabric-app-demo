# Talk agenda — Build Microsoft Fabric Data Apps with Cursor

**Event:** Arizona Data Platform Users Group  
**Organizer:** Ginger Grant  
**Format:** Online, 60 minutes  
**Speaker:** Bobby Lansing (Phoenix DataWorks LLC)  
**Repo:** [phoenixdataworks/fabric-app-demo](https://github.com/phoenixdataworks/fabric-app-demo)

Use this document on stage. Use [speaking-notes.md](speaking-notes.md) for the short cue card. Use [live-demo.md](live-demo.md) for the live coding prompt and fallback.

---

## Goals

1. Show what Fabric Data Apps are and when they fit better than a classic Power BI report.
2. Show a real Cursor workflow: rules, one project skill, and schema Markdown.
3. Teach practices that work in any repository.
4. Leave attendees with this public repo and a clear mental model.

Be honest about preview limits and live-demo risk.

---

## Timed overview

| Time | Section | You show |
|------|---------|----------|
| 0–5 | Opening and context | Title, this repo README |
| 5–15 | What Fabric Data Apps are | `docs/GETTING_STARTED.md`, `docs/CONCEPTS.md`, Migration Pulse in the Fabric App embed |
| 15–30 | Cursor workflow | `.cursor/rules/`, `.cursor/skills/modify-fabric-data-app/`, `schema/tables/`, official skills-for-fabric |
| 30–50 | Live demo | Prompt in [live-demo.md](live-demo.md); Fabric portal embed |
| 50–60 | Takeaways, limits, Q&A | Takeaways below |

Hard stop: 15–18 minutes of live coding. If Cursor or the network fails, paste from [live-demo.md](live-demo.md). Do not debug live past two minutes.

---

## 0–5 — Opening and context

**Aim:** Why this topic matters. Who you are. What attendees will leave with.

**Say:**

- Introduce yourself: founder of Phoenix DataWorks LLC. You build Fabric, Power BI, and code-first data apps with Cursor.
- Power BI reports hit limits when you need custom interaction, operational grids beside charts, or code-first UX.
- Fabric Data Apps are interactive React apps hosted in Fabric. They query a **live semantic model** with DAX.
- This session is practical. You will see a working app, then change it with Cursor.
- Share the repo: [github.com/phoenixdataworks/fabric-app-demo](https://github.com/phoenixdataworks/fabric-app-demo).

**Show:** Title slide or README. Do not start coding.

**Do not:** Build a warehouse or semantic model on stage.

---

## 5–15 — What Fabric Data Apps are

**Aim:** Architecture, when to choose a Data App, and what attendees see in Migration Pulse.

**Say:**

- A Fabric Data App is a first-class Fabric item. It is not a Power BI embed.
- Data path:

  ```text
  Demo DW warehouse  →  semantic model  →  DAX  →  React + Fabric visuals
  ```

- Rayfin is the open-source SDK and CLI behind Fabric Apps. You write TypeScript. Rayfin handles APIs, auth, and hosting as a Fabric item. This demo uses that stack for a **read-only** analytical app.
- Choose a **report** for governed standard analytics. Choose a **Data App** for custom UX on the same semantic model.
- This demo is read-only. Charts and the backlog grid display data. Nothing writes back.
- There is no offline demo mode. Localhost alone does not load data. The Fabric portal provides auth and the DAX embed channel.

**Show:**

1. `docs/GETTING_STARTED.md` — warehouse SQL → semantic model → `fabric.yaml` → `.env.fabric` → portal embed.
2. `docs/CONCEPTS.md` — Data Apps vs reports; auth table.
3. Migration Pulse in the Fabric App with `?fabricEmbedded=true&devUri=http://localhost:5173`.
4. Point at KPIs, area chart, donut, heatmap, and the backlog grid. All of these run live DAX.

**Files to name:**

| Path | Role |
|------|------|
| `warehouse/migration-pulse.sql` | Loads Demo DW |
| `src/queries/src/queries/migration-pulse/queries.ts` | DAX + column metadata |
| `src/queries/migration-pulse/*.json` | Vega-Lite layout |
| `src/pages/MigrationPulsePage.tsx` | Page composition |

---

## 15–30 — Cursor workflow

**Aim:** Rules vs skills vs schema Markdown. Official Fabric skills vs this repo’s one skill.

### Rules (always-on invariants)

**Say:** Rules constrain every chat. Keep them short and specific. Put them in `.cursor/rules/*.mdc`.

**Show** these files:

| Rule | What it enforces |
|------|------------------|
| `stack.mdc` | React + Vite + live DAX; no catalog, admin, or Power BI embed |
| `schema-grounding.mdc` | Do not invent columns; use `schema/tables/` |
| `no-edit-zones.mdc` | Secrets, workspace IDs, and talk notes stay untouched unless asked |
| `technical-english.mdc` | Short, direct copy in docs and UI |

### Schema Markdown

**Say:**

- Commit table docs from [schema-scraper](https://pypi.org/project/schema-scraper/) under `schema/tables/`.
- Cursor then has ground truth for warehouse columns when it writes SQL or DAX.
- Fabric Git integration versions warehouse SQL and semantic model TMDL. That is useful for ALM. Structured Markdown is usually easier for an LLM.
- Best practice: use both. This demo shows the Markdown half plus warehouse bootstrap and live DAX.

**Show:** one file under `schema/tables/` (for example `fact_migration_backlog.md`).

### One project skill

**Say:** Skills are multi-step procedures. This repo ships one: `modify-fabric-data-app`. It tells Cursor how to add a visual without inventing columns or changing auth.

**Show:** `.cursor/skills/modify-fabric-data-app/SKILL.md` — when to use, required context, steps, verification, avoid list.

### Official skills-for-fabric (2–3 minutes)

**Say:** Microsoft publishes [skills-for-fabric](https://github.com/microsoft/skills-for-fabric) for warehouse, lakehouse, semantic model, PBIP, and platform work. That catalog does **not** cover this React Data App layer. That is why this repo has one custom skill.

**Do on stage:**

1. `npx skills add microsoft/skills-for-fabric -a cursor -g -y` (skip if already installed).
2. `npx skills list -g` — show installed Fabric skills.
3. Open one global skill, for example `~/.agents/skills/semantic-model-authoring/SKILL.md`.
4. Contrast with `.cursor/skills/modify-fabric-data-app/` in this repo.
5. Mention scope: `-g` is global (every project on this machine). Omit `-g` to commit skills for the team.

**Fallback:** If install fails, open [microsoft/skills-for-fabric](https://github.com/microsoft/skills-for-fabric) in the browser. The talk still works.

**Other habits to name (do not demo all of them):**

- Prefer Plan mode before Agent mode for non-trivial work.
- Always review agent output.
- Verify with `npm test` and the Fabric App embed.

---

## 30–50 — Live demo: Backlog by risk

**Aim:** Add one Vega bar chart with live DAX over Demo DW. Prove the warehouse → schema scrape → skill + rules path.

**Starting state:** `main` has no “Backlog by risk” chart. Demo DW, semantic model, Fabric App, and portal embed already work.

**Duration:** Target 12 minutes of coding. Hard stop at 15–18 minutes.

**Before stage:** Run `npm run schema:scrape` so `schema/tables/` matches live Demo DW columns (see [live-demo.md](live-demo.md)).

### On-stage prompt

Copy into Cursor Agent (this repo and the skill in context):

```text
Use the modify-fabric-data-app skill.

Add a Vega bar chart titled "Backlog by risk" to Migration Pulse.
Ground on Demo DW table fact_migration_backlog — read schema/tables/fact_migration_backlog.md
(scraped from the Fabric Warehouse; do not invent columns).
Add DAX in src/queries/migration-pulse/queries.ts that counts reports by risk.
Wire with LiveVegaChart so data comes from the live semantic model over Demo DW (not demo tables or committed chart data).
Place the chart above the Migration backlog grid.
Do not change auth or routing.
```

### While it runs

Narrate:

1. `schema/tables/` is scraped from **Demo DW** — Cursor reads warehouse metadata, not guessed columns.
2. DAX in `queries.ts` runs against the **semantic model**; the model reads the warehouse.
3. Vega spec is layout only. **LiveVegaChart** loads rows at runtime through the portal embed.
4. No committed demo tables or offline chart data in the UI.

### Verification

```bash
npm test
npm run dev
```

Open the Fabric App with `?fabricEmbedded=true&devUri=http://localhost:5173`. Confirm the new chart loads from DAX. Confirm the **Live semantic model** badge still appears.

### Fallback

If Cursor or the network fails, paste from [live-demo.md](live-demo.md). Do not debug live past two minutes.

Optional: `git checkout demo/backlog-by-risk` if that branch is available and you need a finished chart immediately.

**Do not:** Create the semantic model, change `fabric.yaml` IDs, or add a second feature.

---

## 50–60 — Takeaways, limits, Q&A

**Aim:** Leave five points. Call out preview limits. Open the floor.

**Takeaways:**

1. Data Apps = code-first read-only UX on **live semantic models** (warehouse → model → DAX).
2. Schema Markdown + short rules make Cursor reliable.
3. Skills = procedures; rules = invariants.
4. Use [skills-for-fabric](https://github.com/microsoft/skills-for-fabric) for the platform. Use this repo’s skill for the Data App layer.
5. One tested rule set + one skill beats a large untested collection.

**Limits to state:**

- Fabric Apps are in preview.
- This demo needs a live semantic model and portal embed. Localhost alone does not load data.
- Security for production read-only apps: workspace permissions, semantic model RLS, and the Fabric embed handshake.

**Decision criteria (if asked):**

| Choose a report when… | Choose a Data App when… |
|------------------------|-------------------------|
| Governed standard analytics | Custom UX on the same data |
| Report consumers only | Rich interaction and layout control |
| Power BI is the delivery surface | Code-first React + Fabric visuals |

**Q&A buffer:** If the live demo ended early, spend the extra minutes here. Do not start a second live change.

---

## Before the talk

Attendees (or you) should have:

1. Demo DW loaded (`npm run warehouse:sql -- --demo`, then run the SQL in Fabric).
2. Semantic model from the warehouse **Reporting** tab.
3. Fabric App item + `.env.fabric` with the publishable key.
4. App open with `?fabricEmbedded=true&devUri=http://localhost:5173`.

Full checklist: [docs/GETTING_STARTED.md](../GETTING_STARTED.md).

Speaker extras:

- Repo is public and the link is ready to paste.
- Official skills already installed globally, or the GitHub page is open as fallback.
- Live prompt copied from [live-demo.md](live-demo.md).
- Dry-run of the 12–15 minute path completed once.

---

## Risks

| Risk | Mitigation |
|------|------------|
| Live Cursor or network failure | Paste from [live-demo.md](live-demo.md). Stop debugging after two minutes. |
| Fabric Apps still in preview | State limits in the last block. |
| Audience expects only Power BI | Keep the Data App value first. Cursor is the accelerator. |
| Time overrun | Hard stop at 15–18 minutes of coding. Move to Q&A. |

---

## Share with attendees

- Repo: https://github.com/phoenixdataworks/fabric-app-demo
- Setup: [docs/GETTING_STARTED.md](../GETTING_STARTED.md)
- Concepts: [docs/CONCEPTS.md](../CONCEPTS.md)
- Official skills: [docs/skills-for-fabric.md](../skills-for-fabric.md)
- Live exercise: [docs/talk/live-demo.md](live-demo.md)
