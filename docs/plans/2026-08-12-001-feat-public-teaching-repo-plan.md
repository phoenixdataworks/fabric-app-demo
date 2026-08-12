---
title: Fabric Data App Demo Teaching Repo - Plan
date: 2026-08-12
type: feat
topic: public-teaching-repo
artifact_contract: ce-unified-plan/v1
artifact_readiness: requirements-only
product_contract_source: ce-brainstorm
execution: code
---

# Fabric Data App Demo Teaching Repo - Plan

## Goal Capsule

Objective: Ship a public, cloneable Microsoft Fabric Data App repo that attendees of the Arizona Data Platform Users Group talk can run locally, inspect Cursor rules and one skill, and use as the 15-minute live-modification exercise.

Product authority: This plan owns the public teaching repo in `fabric-app-demo`. It does not own live Fabric workspace setup, slide decks, or wiring Migration Pulse to a live semantic model.

Open blockers: None. Remaining how-level choices (copy mechanics, exact Vega encodings) are deferred to planning.

## Product Contract

### Summary

Slim the existing Reportal app in `fabric-data-app` into a single-page Migration Pulse demo that runs with committed demo data, no Fabric credentials required.
Add schema Markdown, three short Cursor rules, one `modify-fabric-data-app` skill, CONCEPTS, and 1-page speaking notes.
Leave the backlog-by-risk chart off `main` so the live demo can add it from schema columns.

### Problem Frame

Data professionals in the talk need a repo they can clone after the session.
The current `fabric-data-app` workspace is a full portal (catalog, admin, Power BI embed) and this `fabric-app-demo` workspace is empty.
A public teaching repo that still contains catalog/admin will hide the Cursor lesson and is too much to demo in 15 minutes.

### Key Decisions

- Slim extract from `fabric-data-app`, keep Migration Pulse as the unique visualization. (session-settled: user-directed — chosen over a kch-cma-rayfin extract and a fresh Rayfin template: three-hour window and an already-working Vega page)
- Live change is one new Vega chart from schema Markdown. (session-settled: user-directed — chosen over a 4th KPI, a filter, or a heatmap restyle: best teaching of skill + schema in ~12 minutes)
- Teaching surface is attendee README + CONCEPTS + 1-page speaking notes. (session-settled: user-directed — chosen over README-only and a full slide pack: attendees get the concepts; speaker gets a one-pager)
- `main` stays in the pre-demo state. The backlog-by-risk chart is the exercise, not a shipped visual. Governs R8
- Local `npm run dev` must work with no Fabric login. Demo-data banner stays visible. Governs R2, R3
- Drop catalog, admin, Power BI embed, nested `reportal/`, and the Microsoft `.agents/skills` tree. Governs R4
- Schema Markdown is committed in schema_scraper table format and matches the demo tables. It is not a live scrape. Governs R5
- Teach [microsoft/skills-for-fabric](https://github.com/microsoft/skills-for-fabric) as the official platform catalog. Do not vendor or submodule it. Governs R14

### Actors

- Speaker (Bobby): runs the live Cursor modification during the talk.
- Attendee: clones the repo after the talk, runs it locally, reads CONCEPTS, retries the skill.
- Cursor agent: follows `.cursor/rules` and the `modify-fabric-data-app` skill when asked to change the app.

### Requirements

**App**

- R1. The home route `/` renders Migration Pulse: four KPIs, Vega area (adoption trend), Vega donut (channel mix), Vega heatmap (team readiness), and a DataGrid of the migration backlog.
- R2. `npm install && npm run dev` starts the app with no Fabric credentials, no `.env`, and no Docker.
- R3. The page shows a visible banner that the visuals use committed demo data, not a live semantic model.
- R4. Catalog, admin, Power BI embed, nested `reportal/`, and `.agents/skills` are absent from this repo.

**Schema and Cursor**

- R5. `schema/` contains schema_scraper-style Markdown for the four demo tables, including `fact_migration_backlog.risk` and `fact_migration_backlog.domain`.
- R6. `.cursor/rules/` contains exactly three short rules: stack/versions, schema grounding, and no-edit zones. Always-apply rules stay under 500 lines total.
- R7. `.cursor/skills/modify-fabric-data-app/SKILL.md` is the only skill. It tells the agent when to run, what context to read, the modification steps, verification commands, and what to avoid.

**Live demo**

- R8. `main` does not render a backlog-by-risk (or backlog-by-domain) Vega chart. That chart is the staged live change.
- R9. `docs/talk/live-demo.md` contains the exact on-stage prompt and a paste-ready fallback for the same chart.

**Teaching**

- R10. `README.md` explains how to clone, run, and where rules, skill, schema, and the live exercise live.
- R11. `docs/CONCEPTS.md` explains Fabric Data Apps, Rayfin, Data Apps vs Power BI reports, rules vs skills, schema Markdown vs Fabric Git, and how this repo relates to skills-for-fabric.
- R12. `docs/talk/speaking-notes.md` is a one-page agenda map for the 60-minute talk. The 15–30 minute Cursor section includes 2–3 minutes on skills-for-fabric.
- R14. `docs/skills-for-fabric.md` explains what the official repo is, how Cursor loads it (clone + `.cursorrules`), the five bundles, that skills teach and MCP executes, and the gap this repo fills (no Rayfin / Fabric Data App skill in the official catalog). It links to https://github.com/microsoft/skills-for-fabric and does not copy that repository.

**Public hygiene**

- R13. The repo contains no secrets, no client data, and no `.env.local`. `.gitignore` excludes env files and generated Fabric artifacts.

### Key Flows

F1. Attendee clone: clone → `npm install` → `npm run dev` → open `/` → see Migration Pulse with the demo-data banner.

F2. Live demo: speaker opens Cursor → invokes `modify-fabric-data-app` with the prompt in `docs/talk/live-demo.md` → agent reads schema Markdown → adds a Vega bar of backlog by risk using only documented columns → page shows the new chart beside the existing grid.

F3. Fallback: if Cursor or network fails, speaker pastes the snippet from `docs/talk/live-demo.md` and continues.

### Acceptance Examples

- AE1. Covers R1, R2, R3. After `npm run dev`, `/` shows headings for Adoption trend, Channel mix, Team readiness heatmap, and Migration backlog, plus a demo-data banner. No Fabric login prompt.
- AE2. Covers R8. The starting app has no chart titled "Backlog by risk".
- AE3. Covers R5, R7. An agent following the skill can add that chart using `risk` from `schema/` without inventing a column.
- AE4. Covers R4. Searching the repo finds no `CatalogPage`, no `/admin` route, and no `.agents/skills`.
- AE5. Covers R10, R11. A cold reader can explain rules vs skills vs schema from `docs/CONCEPTS.md` without watching the talk.
- AE6. Covers R14. A cold reader can state that skills-for-fabric is the official Fabric platform catalog, that Cursor uses it by cloning the repo, and that `modify-fabric-data-app` exists because the official set does not cover Rayfin Data Apps.

### Scope Boundaries

In scope: slim Migration Pulse app, schema Markdown, three rules, one skill, README, CONCEPTS, skills-for-fabric teaching page, speaking notes, live-demo prompt + fallback, tests that the home page renders.

Out of scope: live semantic model connection, creating a semantic model on stage, catalog/admin/embed, vendoring or submoduling microsoft/skills-for-fabric, installing their plugin marketplace into this repo, multiple local skills, CI polish, Thermonuclear review as a required step, slide decks, making the repo public (manual GitHub step).

### Assumptions

- Sibling repo `../fabric-data-app` remains the copy source during implementation.
- Demo tables are a fictional MSSQL → Snowflake migration program. They are not real customer data.
- Rayfin models from the source app stay in `rayfin/` so attendees can inspect TypeScript models even though the demo page does not call those APIs.

### Outstanding Questions

- Deferred to Planning: exact Vega-Lite encoding for the fallback backlog-by-risk chart.
- Deferred to Planning: whether `package.json` name stays `reportal` or becomes `fabric-app-demo`.
