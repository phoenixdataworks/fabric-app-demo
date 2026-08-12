# Fabric Data App Demo Teaching Repo Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Turn this empty repo into a public, locally runnable Fabric Data App demo with Migration Pulse visuals, schema Markdown, three Cursor rules, one skill, and talk teaching docs.

**Architecture:** Copy the working Migration Pulse slice from sibling `../fabric-data-app`, delete catalog/admin/embed, make `/` the demo page, and add teaching artifacts. `main` stays in the pre-demo state so the live talk can add a backlog-by-risk Vega chart.

**Tech Stack:** React 19, Vite 7, TypeScript 5.7, Tailwind 4, `@microsoft/fabric-visuals`, `@microsoft/fabric-datagrid`, Rayfin, Vitest.

**Origin:** `docs/plans/2026-08-12-001-feat-public-teaching-repo-plan.md`

## Global Constraints

- Prefer reuse of `../fabric-data-app` over new features.
- Do not wire visuals to a live semantic model.
- Do not add a backlog-by-risk chart on `main`.
- Do not copy `.agents/skills`, `reportal/`, catalog, admin, or Power BI embed.
- Do not commit `.env.local` or secrets.
- Always-apply Cursor rules stay under 500 lines total.
- Exactly one skill: `modify-fabric-data-app`.
- `npm install && npm run dev` must work with no Fabric credentials.

## File map

**Copy unchanged from `../fabric-data-app`:**

- `tsconfig.json`, `vite.config.ts`, `vitest.config.ts`, `eslint.config.js`, `components.json`, `fabric.yaml`, `.gitignore`
- `src/main.tsx`, `src/ErrorFallback.tsx`, `src/global.css`, `src/vite-env.d.ts`, `src/test/setup.ts`
- `src/lib/utils.ts`, `src/lib/to-data-table.ts`, `src/lib/to-data-table.spec.ts`
- `src/lib/demo-report/build-data-table.ts`, `src/lib/demo-report/migration-pulse-data.ts`
- `src/lib/rayfin-client.ts`, `src/lib/fabric-auth.ts`, `src/lib/fabric-client.ts`
- `src/hooks/use-theme.ts`, `src/hooks/theme.context.ts`, `src/hooks/use-auth.tsx`, `src/hooks/auth.context.ts`
- `src/components/demo/ChartCard.tsx`, `src/components/demo/MigrationPulseKpis.tsx`
- `src/queries/migration-pulse/index.ts`, `adoption-trend.json`, `report-mix.json`, `team-readiness.json`
- `rayfin/data/*.ts`, `rayfin/rayfin.yml`, `rayfin/tsconfig.json`, `rayfin/.lockfile.json`

**Create or rewrite:**

- `package.json`, `index.html`, `src/App.tsx`, `src/App.spec.tsx`
- `src/pages/MigrationPulsePage.tsx` (from `src/pages/custom/MigrationPulsePage.tsx`, drop catalog back-link)
- `src/components/layout/PortalShell.tsx` (drop admin)
- `.cursor/rules/*.mdc` (3 files)
- `.cursor/skills/modify-fabric-data-app/SKILL.md`
- `schema/README.md` plus four table Markdown files
- `README.md`, `docs/CONCEPTS.md`, `docs/skills-for-fabric.md`, `docs/talk/speaking-notes.md`, `docs/talk/live-demo.md`
- `LICENSE` (keep MIT; note Microsoft template + Phoenix DataWorks teaching layer)

**Do not copy:** `src/pages/admin/**`, `src/pages/CatalogPage.tsx`, `src/pages/ReportViewPage.tsx`, `src/pages/CustomWelcomePage.tsx`, `src/components/admin/**`, `src/components/catalog/**`, `src/lib/catalog/**`, `src/lib/admin/**`, `src/lib/powerbi/**`, `src/services/**`, `src/hooks/use-admin.ts`, `src/hooks/use-catalog.ts`, `reportal/**`, `.agents/**`, `docs/ADMIN.md`, `docs/PRD.md`, `docs/POWERBI_EMBED.md`, `docs/DATA_MODEL.md`, `docs/REMAINING_WORK.md`, `.env.local`

---

### Task 1: Copy the runnable slice and slim package.json

**Files:**
- Create: copied files listed above
- Create: `package.json`
- Modify: `index.html`

**Interfaces:**
- Consumes: sibling `../fabric-data-app`
- Produces: a Vite app that typechecks once App.tsx exists in Task 2

- [ ] **Step 1: Copy the keep-list**

From repo root:

```bash
SRC="../fabric-data-app"

cp "$SRC/tsconfig.json" "$SRC/vite.config.ts" "$SRC/vitest.config.ts" \
   "$SRC/eslint.config.js" "$SRC/components.json" "$SRC/fabric.yaml" \
   "$SRC/.gitignore" "$SRC/index.html" .

mkdir -p src/lib/demo-report src/hooks src/components/demo src/components/layout \
         src/queries/migration-pulse src/test src/pages rayfin/data

cp "$SRC/src/main.tsx" "$SRC/src/ErrorFallback.tsx" "$SRC/src/global.css" \
   "$SRC/src/vite-env.d.ts" src/
cp "$SRC/src/test/setup.ts" src/test/
cp "$SRC/src/lib/utils.ts" "$SRC/src/lib/to-data-table.ts" \
   "$SRC/src/lib/to-data-table.spec.ts" \
   "$SRC/src/lib/rayfin-client.ts" "$SRC/src/lib/fabric-auth.ts" \
   "$SRC/src/lib/fabric-client.ts" src/lib/
cp "$SRC/src/lib/demo-report/"*.ts src/lib/demo-report/
cp "$SRC/src/hooks/use-theme.ts" "$SRC/src/hooks/theme.context.ts" \
   "$SRC/src/hooks/use-auth.tsx" "$SRC/src/hooks/auth.context.ts" src/hooks/
cp "$SRC/src/components/demo/"*.tsx src/components/demo/
cp "$SRC/src/queries/migration-pulse/"* src/queries/migration-pulse/
cp "$SRC/rayfin/data/"*.ts rayfin/data/
cp "$SRC/rayfin/rayfin.yml" "$SRC/rayfin/tsconfig.json" "$SRC/rayfin/.lockfile.json" rayfin/
```

- [ ] **Step 2: Write `package.json`**

Name the package `fabric-app-demo`. Drop `powerbi-client` and embed-client packages. Keep Rayfin + Fabric visuals so AuthProvider and Vega still compile.

```json
{
  "name": "fabric-app-demo",
  "description": "Public teaching repo: Microsoft Fabric Data App + Cursor rules/skill demo (Migration Pulse).",
  "license": "MIT",
  "private": true,
  "version": "0.1.0",
  "type": "module",
  "scripts": {
    "predev": "rayfin env --framework vite",
    "prebuild": "rayfin env --framework vite",
    "dev": "vite",
    "dev:fabric": "vite --mode fabric",
    "build": "npx fabric-app-data generate -o src/fabric.generated.ts && tsc -b --noCheck && vite build",
    "lint": "eslint .",
    "preview": "vite preview",
    "test": "vitest run"
  },
  "dependencies": {
    "@microsoft/fabric-app-data": "0.1.6",
    "@microsoft/fabric-app-data-proxy": "0.1.2",
    "@microsoft/fabric-datagrid": "0.0.10",
    "@microsoft/fabric-visuals": "0.0.9",
    "@microsoft/fabric-visuals-core": "0.0.9",
    "@microsoft/rayfin-auth-provider-fabric": "^1.26.0",
    "@microsoft/rayfin-client": "^1.29.0",
    "@microsoft/rayfin-core": "^1.29.0",
    "@microsoft/rayfin-data": "^1.29.0",
    "@microsoft/rayfin-lib": "^1.26.0",
    "@tailwindcss/vite": "^4.2.1",
    "clsx": "^2.1.1",
    "framer-motion": "^12.6.2",
    "lucide-react": "^0.577.0",
    "react": "^19.0.0",
    "react-dom": "^19.2.5",
    "react-error-boundary": "^6.0.0",
    "react-router-dom": "^7.1.1",
    "tailwind-merge": "^3.5.0",
    "tailwindcss": "^4.2.1"
  },
  "devDependencies": {
    "@eslint/js": "^9.21.0",
    "@microsoft/fabric-app-data-cli": "0.1.6",
    "@microsoft/fabric-app-data-cli-proxy": "0.1.6",
    "@microsoft/rayfin-cli": "^1.20.0",
    "@testing-library/jest-dom": "^6.6.3",
    "@testing-library/react": "^16.3.0",
    "@types/react": "^19.2.14",
    "@types/react-dom": "^19.2.3",
    "@vitejs/plugin-react-swc": "^4.2.2",
    "eslint": "^9.28.0",
    "eslint-plugin-react-hooks": "^5.2.0",
    "eslint-plugin-react-refresh": "^0.4.19",
    "globals": "^16.0.0",
    "jsdom": "^26.1.0",
    "rollup-plugin-license": "^3.7.1",
    "typescript": "~5.7.2",
    "typescript-eslint": "^8.38.0",
    "vite": "^7.2.6",
    "vitest": "^3.2.2"
  }
}
```

- [ ] **Step 3: Set the HTML title**

In `index.html`, set `<title>Migration Pulse — Fabric Data App Demo</title>`.

- [ ] **Step 4: Confirm `.gitignore` excludes secrets**

Ensure these lines exist (add if missing):

```
node_modules
dist
src/fabric.generated.ts
*.local
rayfin/.env*
rayfin/.deployments.json
rayfin/.temp/
.DS_Store
```

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "$(cat <<'EOF'
chore: copy Migration Pulse slice from fabric-data-app

EOF
)"
```

---

### Task 2: Make Migration Pulse the home page

**Files:**
- Create: `src/pages/MigrationPulsePage.tsx`
- Create: `src/components/layout/PortalShell.tsx`
- Create: `src/App.tsx`
- Test: `src/App.spec.tsx`

**Interfaces:**
- Consumes: demo data, Vega specs, ChartCard, KPIs from Task 1
- Produces: `/` renders Migration Pulse with no catalog back-link and no admin chrome

- [ ] **Step 1: Write the failing test**

```tsx
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import App from "@/App";
import { ThemeContext } from "@/hooks/theme.context";

describe("App", () => {
  it("renders Migration Pulse on the home route", async () => {
    render(
      <ThemeContext.Provider value={{ isDark: false, toggleTheme: () => {} }}>
        <App />
      </ThemeContext.Provider>,
    );
    expect(
      await screen.findByRole("heading", { name: /Migration Pulse/i }),
    ).toBeInTheDocument();
    expect(screen.getByText(/Demo data/i)).toBeInTheDocument();
    expect(screen.getByText(/Adoption trend/i)).toBeInTheDocument();
    expect(screen.getByText(/Channel mix/i)).toBeInTheDocument();
    expect(screen.getByText(/Team readiness heatmap/i)).toBeInTheDocument();
    expect(screen.getByText(/Migration backlog/i)).toBeInTheDocument();
    expect(screen.queryByText(/Backlog by risk/i)).not.toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run the test and confirm it fails**

```bash
npm install
npm test -- src/App.spec.tsx
```

Expected: FAIL because `src/App.tsx` does not exist yet.

- [ ] **Step 3: Write `src/components/layout/PortalShell.tsx`**

```tsx
import type { ReactNode } from 'react';
import { Moon, Sun } from 'lucide-react';

import { useThemeContext } from '@/hooks/theme.context';
import { cn } from '@/lib/utils';

interface PortalShellProps {
  children: ReactNode;
}

export function PortalShell({ children }: PortalShellProps) {
  const { isDark, toggleTheme } = useThemeContext();

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b border-border bg-card">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-6 py-4">
          <div>
            <p className="text-200 font-medium uppercase tracking-wider text-muted-foreground">
              Fabric Data App Demo
            </p>
            <h1 className="text-hero-700 font-semibold text-foreground">
              Migration Pulse
            </h1>
          </div>
          <button
            type="button"
            onClick={toggleTheme}
            className={cn(
              'inline-flex items-center gap-2 rounded-md border border-border px-3 py-1.5 text-300',
              'hover:bg-accent',
            )}
            aria-label={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
          >
            {isDark ? (
              <Sun className="size-4" aria-hidden />
            ) : (
              <Moon className="size-4" aria-hidden />
            )}
            Theme
          </button>
        </div>
      </header>
      <main className="mx-auto max-w-7xl px-6 py-8">{children}</main>
    </div>
  );
}
```

- [ ] **Step 4: Write `src/pages/MigrationPulsePage.tsx`**

Copy `../fabric-data-app/src/pages/custom/MigrationPulsePage.tsx` and apply these edits:

1. Remove the `Link` import and the "← Catalog" link.
2. Change the page `<h2>Migration Pulse</h2>` to a visually hidden or keep as `h2` — the shell already has `h1`. Keep an `h2` with text `Migration Pulse` so the test can find it, or change the test to use the shell `h1`. Prefer: keep a visible `h2` "Custom analytics page" and assert on the shell `h1` in the test. Simplest: the shell `h1` is "Migration Pulse", so the test already passes. Drop the duplicate `h2` title or keep a short subtitle only.

Use this page body:

```tsx
import { VegaVisual, useCssTheme } from '@microsoft/fabric-visuals';
import { DataGrid } from '@microsoft/fabric-datagrid';

import { ChartCard } from '@/components/demo/ChartCard';
import { MigrationPulseKpis } from '@/components/demo/MigrationPulseKpis';
import { PortalShell } from '@/components/layout/PortalShell';
import {
  adoptionTrendTable,
  backlogTable,
  reportMixTable,
  teamReadinessTable,
} from '@/lib/demo-report/migration-pulse-data';
import {
  adoptionTrendVegaSpec,
  reportMixVegaSpec,
  teamReadinessVegaSpec,
} from '@/queries/migration-pulse';

export function MigrationPulsePage() {
  const theme = useCssTheme();

  return (
    <PortalShell>
      <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="max-w-2xl text-400 text-muted-foreground">
            Interactive Fabric Data App on top of a semantic-model-shaped dataset.
            Built with React + Fabric Vega visuals — no Power BI embed required.
          </p>
        </div>
        <p className="rounded-md border border-dashed border-border bg-muted/40 px-3 py-2 text-200 text-muted-foreground">
          Demo data · not connected to a live semantic model
        </p>
      </div>

      <MigrationPulseKpis />

      <div className="mt-6 grid gap-4 lg:grid-cols-5 lg:items-stretch">
        <div className="lg:col-span-3 lg:min-h-[340px]">
          <ChartCard
            title="Adoption trend"
            subtitle="Legacy MSSQL reports declining as Snowflake-backed Power BI grows"
            minHeight={320}
          >
            <VegaVisual
              spec={adoptionTrendVegaSpec}
              data={adoptionTrendTable}
              theme={theme}
            />
          </ChartCard>
        </div>
        <div className="lg:col-span-2 lg:min-h-[340px]">
          <ChartCard
            title="Channel mix"
            subtitle="Where users spend time today"
            minHeight={320}
          >
            <VegaVisual
              spec={reportMixVegaSpec}
              data={reportMixTable}
              theme={theme}
            />
          </ChartCard>
        </div>
      </div>

      <div className="mt-4 min-h-[300px]">
        <ChartCard
          title="Team readiness heatmap"
          subtitle="Weekly migration readiness score by business domain"
          minHeight={280}
        >
          <VegaVisual
            spec={teamReadinessVegaSpec}
            data={teamReadinessTable}
            theme={theme}
          />
        </ChartCard>
      </div>

      <div className="mt-4">
        <ChartCard
          title="Migration backlog"
          subtitle="Sortable grid — typical operational view not available in standard Power BI tiles"
          minHeight={260}
        >
          <div className="flex min-h-0 flex-1 flex-col overflow-auto">
            <DataGrid data={backlogTable} theme={theme} />
          </div>
        </ChartCard>
      </div>
    </PortalShell>
  );
}
```

- [ ] **Step 5: Write `src/App.tsx`**

```tsx
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';

import { MigrationPulsePage } from '@/pages/MigrationPulsePage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MigrationPulsePage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
```

- [ ] **Step 6: Run tests**

```bash
npm test
```

Expected: PASS, including "renders Migration Pulse on the home route".

- [ ] **Step 7: Commit**

```bash
git add src/App.tsx src/App.spec.tsx src/pages/MigrationPulsePage.tsx src/components/layout/PortalShell.tsx
git commit -m "$(cat <<'EOF'
feat: make Migration Pulse the home page

EOF
)"
```

---

### Task 3: Schema Markdown in schema_scraper format

**Files:**
- Create: `schema/README.md`
- Create: `schema/tables/fact_report_adoption.md`
- Create: `schema/tables/fact_channel_mix.md`
- Create: `schema/tables/fact_team_readiness.md`
- Create: `schema/tables/fact_migration_backlog.md`

**Interfaces:**
- Consumes: column names in `src/lib/demo-report/migration-pulse-data.ts`
- Produces: the only column vocabulary Cursor is allowed to use (R5)

- [ ] **Step 1: Write `schema/README.md`**

```markdown
# Schema context

These Markdown files are in [schema_scraper](https://github.com/phoenixdataworks/schema_scraper) table format.

In production, generate them from the warehouse or SQL endpoint:

```bash
schema-scraper scrape -t mssql -h <host> -d <database> --trusted
```

This demo commits a small fictional **migration program** schema so Cursor has high-quality context without a live database.

Cursor rules in `.cursor/rules/schema-grounding.mdc` point here. **Never invent columns that are not listed.**
```

- [ ] **Step 2: Write the four table files**

`schema/tables/fact_report_adoption.md`:

```markdown
# dbo.fact_report_adoption

Monthly report counts on the legacy MSSQL path vs the Snowflake path.

## Columns

| Column | Type | Nullable | Description |
|--------|------|----------|-------------|
| month | nvarchar(10) | NO | Calendar month label (Jan, Feb, …) |
| legacy_mssql | int | NO | Reports still served from MSSQL |
| snowflake | int | NO | Reports served from the Snowflake path |
```

`schema/tables/fact_channel_mix.md`:

```markdown
# dbo.fact_channel_mix

Current catalog composition by delivery channel.

## Columns

| Column | Type | Nullable | Description |
|--------|------|----------|-------------|
| channel | nvarchar(100) | NO | Delivery channel name |
| reports | int | NO | Report count in this channel |
```

`schema/tables/fact_team_readiness.md`:

```markdown
# dbo.fact_team_readiness

Weekly migration readiness score by business team.

## Columns

| Column | Type | Nullable | Description |
|--------|------|----------|-------------|
| team | nvarchar(50) | NO | Business domain (Finance, Operations, Clinical, Engineering, Executive) |
| week | nvarchar(10) | NO | Week label (W1–W4) |
| readiness | int | NO | Readiness score 0–100 |
```

`schema/tables/fact_migration_backlog.md`:

```markdown
# dbo.fact_migration_backlog

In-flight report migrations. Source for the Migration Pulse backlog grid.

## Columns

| Column | Type | Nullable | Description |
|--------|------|----------|-------------|
| report | nvarchar(200) | NO | Report display name |
| domain | nvarchar(50) | NO | Business domain |
| owner | nvarchar(100) | NO | Migration owner |
| stage | nvarchar(50) | NO | Discovery, Model rewrite, Validation, UAT, Published |
| risk | nvarchar(20) | NO | Low, Medium, or High |
| target_date | date | NO | Target completion date |
```

Column names must match `migration-pulse-data.ts` field `name` values (`report`, `domain`, `owner`, `stage`, `risk`, `targetDate` in code vs `target_date` in SQL). Add a note at the bottom of `fact_migration_backlog.md`:

```markdown
## App field mapping

The React demo table uses `targetDate` for `target_date`. All other column names match the app field names exactly.
```

- [ ] **Step 3: Commit**

```bash
git add schema
git commit -m "$(cat <<'EOF'
docs: add schema_scraper-style Markdown for demo tables

EOF
)"
```

---

### Task 4: Three Cursor rules

**Files:**
- Create: `.cursor/rules/stack.mdc`
- Create: `.cursor/rules/schema-grounding.mdc`
- Create: `.cursor/rules/no-edit-zones.mdc`

**Interfaces:**
- Consumes: R6, schema path from Task 3
- Produces: always-on constraints the live skill relies on

- [ ] **Step 1: Write `.cursor/rules/stack.mdc`**

```markdown
---
description: Stack, versions, and demo-app invariants
alwaysApply: true
---

# Stack

This is a Microsoft Fabric Data App (Rayfin) teaching demo.

- React 19 + Vite 7 + TypeScript 5.7 + Tailwind 4
- Visuals: `@microsoft/fabric-visuals` Vega-Lite + `@microsoft/fabric-datagrid`
- Data on the home page is committed demo tables in `src/lib/demo-report/migration-pulse-data.ts`
- Rayfin TypeScript models live in `rayfin/data/` (inspectable; the demo page does not call them)

Prefer small, reviewable diffs. Do not add catalog, admin, or Power BI embed.

Verification after UI changes:

1. `npm test`
2. `npm run dev` and confirm `/` still renders Migration Pulse
```

- [ ] **Step 2: Write `.cursor/rules/schema-grounding.mdc`**

```markdown
---
description: Never invent columns; use schema Markdown as source of truth
globs: src/**/*.{ts,tsx,json}
---

# Schema grounding

Before adding or changing a visual, query, or table column:

1. Read `schema/README.md` and the matching file under `schema/tables/`.
2. Use only columns listed there.
3. NEVER invent columns, measures, or tables that are not in those Markdown files.
4. If the user asks for a field that is not in schema Markdown, stop and say it is not in the schema.

The live demo exercise uses `fact_migration_backlog.risk` (and optionally `domain`).
```

- [ ] **Step 3: Write `.cursor/rules/no-edit-zones.mdc`**

```markdown
---
description: Files the agent must not edit unless the user explicitly asks
alwaysApply: true
---

# No-edit zones

NEVER edit unless the user explicitly names the file:

- `rayfin/.env*` and any secrets
- `rayfin/.lockfile.json`
- `src/fabric.generated.ts` (generated)
- `.cursor/rules/` and `.cursor/skills/` during a normal feature change
- `docs/talk/speaking-notes.md` during a visual change

Do not run `rayfin up`, deploy, or change Fabric workspace IDs unless asked.
```

- [ ] **Step 4: Count lines**

Confirm the three always-apply / glob rules together are well under 500 lines.

- [ ] **Step 5: Commit**

```bash
git add .cursor/rules
git commit -m "$(cat <<'EOF'
chore: add three short Cursor rules for the teaching demo

EOF
)"
```

---

### Task 5: Single skill `modify-fabric-data-app`

**Files:**
- Create: `.cursor/skills/modify-fabric-data-app/SKILL.md`

**Interfaces:**
- Consumes: schema from Task 3, rules from Task 4, page from Task 2
- Produces: the procedure used on stage (R7, R8)

- [ ] **Step 1: Write the skill**

```markdown
---
name: modify-fabric-data-app
description: Safely modify this Fabric Data App using schema Markdown and the connected demo tables. Use when adding or changing a visual, KPI, or grid on Migration Pulse.
---

# Modify Fabric Data App

## When to use

The user wants a small, reviewable change to the existing Migration Pulse page (new chart, KPI, or grid column) while staying aligned with `schema/` and the demo tables.

## Required context

Read before editing:

1. `schema/README.md` and the relevant `schema/tables/*.md`
2. `src/lib/demo-report/migration-pulse-data.ts`
3. `src/pages/MigrationPulsePage.tsx`
4. `src/queries/migration-pulse/`
5. `.cursor/rules/schema-grounding.mdc`

## Steps

1. Identify the requested visual and the schema table it uses.
2. Confirm every field exists in schema Markdown. If not, stop.
3. Reuse existing demo tables when the data is already in `migration-pulse-data.ts`. Do not invent rows.
4. Add a Vega-Lite spec JSON next to the other specs in `src/queries/migration-pulse/` when adding a chart.
5. Export the spec from `src/queries/migration-pulse/index.ts`.
6. Wire a `ChartCard` + `VegaVisual` (or DataGrid) into `MigrationPulsePage.tsx`.
7. Do not change auth, Rayfin models, routing, or branding unless asked.

## Verification

- `npm test`
- `npm run dev` — confirm `/` still loads and the new visual is visible
- Confirm the new visual title is specific (not "Chart")

## Avoid

- Inventing columns not in `schema/`
- Large refactors
- Changing auth or deploy config
- Adding catalog, admin, or Power BI embed
- Connecting to a live semantic model unless the user explicitly asks and `fabric.yaml` already has a connection
```

- [ ] **Step 2: Commit**

```bash
git add .cursor/skills
git commit -m "$(cat <<'EOF'
feat: add modify-fabric-data-app skill

EOF
)"
```

---

### Task 6: Teaching docs and live-demo fallback

**Files:**
- Create: `README.md`
- Create: `docs/CONCEPTS.md`
- Create: `docs/skills-for-fabric.md`
- Create: `docs/talk/speaking-notes.md`
- Create: `docs/talk/live-demo.md`

**Interfaces:**
- Consumes: R9–R12, R14
- Produces: attendee + speaker teaching layer, including the official skills-for-fabric discussion

- [ ] **Step 1: Write `README.md`**

```markdown
# Fabric Data App Demo

Public teaching repo for **Build Microsoft Fabric Data Apps with Cursor** (Arizona Data Platform Users Group).

This repo is a slim Microsoft Fabric Data App. The home page is **Migration Pulse**: KPIs plus Vega area, donut, heatmap, and a backlog grid. Data is committed demo tables so you can run it without Fabric credentials.

## Quick start

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173).

## What to inspect

| Path | Why it exists |
|------|----------------|
| `src/pages/MigrationPulsePage.tsx` | The unique visualization |
| `schema/` | schema_scraper-style Markdown Cursor is required to obey |
| `.cursor/rules/` | Always-on constraints (stack, schema grounding, no-edit zones) |
| `.cursor/skills/modify-fabric-data-app/` | The one repeatable modification procedure |
| `docs/CONCEPTS.md` | Rules vs skills vs schema vs Rayfin vs Power BI |
| `docs/skills-for-fabric.md` | Official Microsoft catalog vs this repo's one Data App skill |
| `docs/talk/live-demo.md` | The 15-minute exercise: add backlog-by-risk |
| `rayfin/data/` | TypeScript models Rayfin uses to generate APIs and hosting |

## Live exercise

`main` does **not** include a "Backlog by risk" chart on purpose. Follow `docs/talk/live-demo.md` (or ask Cursor to use the `modify-fabric-data-app` skill).

## Official Fabric skills

This repo's one skill is for the **Data App code**. For warehouses, lakehouses, semantic models, and PBIP, use Microsoft's catalog: [microsoft/skills-for-fabric](https://github.com/microsoft/skills-for-fabric). How that fits with Cursor is in `docs/skills-for-fabric.md`.

## Deploy to Fabric (optional)

Requires a Fabric workspace and Rayfin login. Not needed to learn from this repo.

```bash
npx rayfin login
npx rayfin up
npm run dev:fabric
```

## License

MIT. App shell derived from the Microsoft Fabric Data Apps template. Teaching artifacts by Phoenix DataWorks LLC.
```

- [ ] **Step 2: Write `docs/CONCEPTS.md`**

Cover these sections, each 1–3 short paragraphs:

1. **Fabric Data Apps** — interactive apps inside Fabric; can replace or extend Power BI reports when you need custom interaction, write-back, or embedded logic.
2. **Rayfin** — open-source SDK/CLI: TypeScript models with decorators → APIs, auth, hosting, Fabric item. Quote the talk-ready explanation from the session plan.
3. **When vs a Power BI report** — reports win for governed paginated/analytical consumption; Data Apps win for custom UX on the same semantic model.
4. **Rules vs skills** — rules are invariants (`.cursor/rules/*.mdc`); skills are multi-step procedures (`.cursor/skills/.../SKILL.md`). This repo has three rules and one skill.
5. **Schema context** — commit schema_scraper Markdown; point rules at it. Fabric Git (warehouse `.sql`, TMDL) is valuable versioning but less LLM-friendly. Best practice is both; this demo shows the Markdown half.
6. **Public skills landscape** — Point to `docs/skills-for-fabric.md`. One paragraph: official catalog covers the platform; this repo's skill covers the Rayfin Data App gap.
7. **Honesty** — Fabric Apps are preview; this demo uses committed data so clone-and-run is reliable. `use-semantic-model-query` in the Microsoft template is how live DAX would work.

Keep CONCEPTS under ~150 lines. The skills-for-fabric page can be longer.

- [ ] **Step 2b: Write `docs/skills-for-fabric.md`**

Use this content (do not clone the Microsoft repo into this project):

```markdown
# Skills for Fabric (official)

Microsoft publishes reusable AI-assistant instructions for Fabric workloads in [microsoft/skills-for-fabric](https://github.com/microsoft/skills-for-fabric).

Docs: [Skills for Fabric overview](https://learn.microsoft.com/en-us/fabric/fundamentals/skills-for-fabric-overview) · [Install](https://learn.microsoft.com/en-us/fabric/fundamentals/skills-for-fabric-install)

## What it is

Skills teach an AI coding tool *what to do* with Fabric: which REST APIs to call, which T-SQL / DAX / KQL / Spark patterns to use, and which operational habits to follow.

MCP servers *do it*: live tool access to data and APIs. Skills and MCP work best together. This demo repo does not install Fabric MCP servers.

## How Cursor loads it

Copilot CLI and Claude Code install marketplace bundles (`/plugin marketplace add microsoft/skills-for-fabric`).

Cursor does not use that marketplace the same way. Clone the repo (or add it as a sibling) so root `.cursorrules` / `AGENTS.md` are picked up:

    git clone https://github.com/microsoft/skills-for-fabric.git

Then open that folder in Cursor, or point the agent at `skills/` when the task is warehouse, lakehouse, semantic model, or PBIP work.

Do **not** copy the whole catalog into this Data App repo. Keep this project to three rules and one skill.

## Bundles

| Bundle | Use it for |
|--------|------------|
| `fabric-skills` | Full platform set (authoring, consumption, operations, migration). Does **not** include Power BI report authoring. |
| `fabric-authoring` | REST, notebooks, T-SQL, KQL, Dataflows, Eventstreams, semantic models |
| `fabric-consumption` | Read-only query and discovery |
| `fabric-operations` | Warehouse/Spark diagnostics |
| `powerbi-authoring` | Separate plug-in: semantic models, PBIP, report plan/design/author/manage |

Most live operations need `az login` and a Fabric token.

## What it covers well

Warehouse, Lakehouse/Spark, Eventhouse/KQL, Eventstreams, Activator, Dataflows Gen2, catalog search, Git integration, deployment pipelines, semantic model authoring, Power BI report PBIP, migrations (Synapse, Databricks, HDInsight).

Experimental agent specializations in `agents/` include `FabricDataEngineer`, `FabricAdmin`, `FabricIQ`, `FabricMigrationEngineer`, and `FabricAppDev`.

## The gap this repo fills

`FabricAppDev` builds **Python** apps that connect to Fabric over ODBC / XMLA / REST. The official "dashboard app" example is a Python dashboard against a warehouse, not a [Fabric Data App](https://learn.microsoft.com/en-us/fabric/apps/overview).

There is no official skill for modifying a **Rayfin / TypeScript Fabric Data App** (Vega visuals, `rayfin/data` models, schema-grounded page changes). That is why this repo ships exactly one custom skill: `.cursor/skills/modify-fabric-data-app/`.

Use both:

- skills-for-fabric when the work is the **platform** (warehouse, semantic model, PBIP, Git).
- `modify-fabric-data-app` when the work is **this app's React + Rayfin layer**.
```

- [ ] **Step 3: Write `docs/talk/speaking-notes.md`**

One page, mapped to the 60-minute agenda:

```markdown
# Speaking notes (60 min)

**Repo:** share this GitHub URL after the opening.

| Time | Say | Show |
|------|-----|------|
| 0–5 | Who I am. Power BI reports hit limits with custom interaction / write-back / embedded logic. | Title + this repo |
| 5–15 | What Fabric Data Apps are. Rayfin: TypeScript models → APIs, auth, hosting. When they beat a classic report. | `docs/CONCEPTS.md` sections 1–3, `rayfin/data/` |
| 15–30 | Cursor: short rules, one skill, schema Markdown. Then 2–3 min on [skills-for-fabric](https://github.com/microsoft/skills-for-fabric): official platform catalog; Cursor clones it; `FabricAppDev` is Python/ODBC not Rayfin; that gap is why we wrote one skill. | `.cursor/rules/`, the skill, `schema/`, `docs/skills-for-fabric.md` |
| 30–50 | Live: add backlog-by-risk from schema. Hard stop at 15–18 min of coding. | `docs/talk/live-demo.md` |
| 50–60 | Takeaways. Preview limitations. Q&A. | Five takeaways in CONCEPTS |

**Fallback:** if Cursor fails, paste the snippet in `live-demo.md`. Do not debug live past two minutes.

**Takeaways**
1. Data Apps (Rayfin) = code-first UX on semantic models.
2. Schema Markdown + short rules make Cursor reliable.
3. Skills = procedures; rules = invariants.
4. Fabric Git versions items; scraper Markdown teaches the model to the LLM.
5. One rule set + one skill beats a large untested collection. Use microsoft/skills-for-fabric for the platform; use this repo's skill for the Data App.
```

- [ ] **Step 4: Write `docs/talk/live-demo.md`**

Include the exact prompt and the fallback files.

**On-stage prompt (copy into Cursor Agent, with the skill in context):**

```text
Use the modify-fabric-data-app skill.

Add a Vega bar chart titled "Backlog by risk" to Migration Pulse.
Use only columns from schema/tables/fact_migration_backlog.md.
Aggregate the existing backlogTable rows by the risk column.
Place the chart above the Migration backlog grid.
Do not invent columns. Do not change auth or routing.
```

**Fallback Vega spec** — `src/queries/migration-pulse/backlog-by-risk.json` (do not add this file on `main` until the live demo; keep it only in this doc):

```json
{
  "$schema": "https://vega.github.io/schema/vega-lite/v5.json",
  "width": "container",
  "height": "container",
  "data": { "name": "source" },
  "mark": { "type": "bar" },
  "encoding": {
    "x": { "field": "risk", "type": "nominal", "sort": ["Low", "Medium", "High"], "title": "Risk" },
    "y": { "aggregate": "count", "type": "quantitative", "title": "Reports" },
    "color": {
      "field": "risk",
      "type": "nominal",
      "scale": { "domain": ["Low", "Medium", "High"], "range": ["#2d8a6f", "#c4a35a", "#c50f1f"] },
      "legend": null
    },
    "tooltip": [
      { "field": "risk", "type": "nominal" },
      { "aggregate": "count", "type": "quantitative", "title": "Reports" }
    ]
  },
  "view": { "stroke": null }
}
```

**Fallback page snippet** (insert above the Migration backlog `ChartCard`):

```tsx
<ChartCard
  title="Backlog by risk"
  subtitle="Count of in-flight reports by risk — from fact_migration_backlog.risk"
  minHeight={240}
>
  <VegaVisual spec={backlogByRiskVegaSpec} data={backlogTable} theme={theme} />
</ChartCard>
```

Export in `src/queries/migration-pulse/index.ts`:

```ts
import backlogByRiskSpec from './backlog-by-risk.json';
export const backlogByRiskVegaSpec = backlogByRiskSpec as VisualizationSpec;
```

- [ ] **Step 5: Commit**

```bash
git add README.md docs/CONCEPTS.md docs/skills-for-fabric.md docs/talk
git commit -m "$(cat <<'EOF'
docs: add CONCEPTS, speaking notes, and live-demo path

EOF
)"
```

---

### Task 7: Verify local run and public hygiene

**Files:**
- Modify: `LICENSE` only if missing
- Test: `src/App.spec.tsx` (already from Task 2)

**Interfaces:**
- Consumes: Tasks 1–6
- Produces: AE1–AE5 evidence

- [ ] **Step 1: Write MIT LICENSE**

Keep MIT. Body: copyright Microsoft Corporation for the template-derived app shell; Phoenix DataWorks LLC for teaching artifacts. If a single LICENSE is simpler, use MIT with:

```
Copyright (c) Microsoft Corporation (Fabric Data Apps template)
Copyright (c) Phoenix DataWorks LLC (teaching repo)
```

- [ ] **Step 2: Secret scan**

```bash
rg -n "password|secret|client_secret|AccountKey" --glob '!.git/**' --glob '!node_modules/**' --glob '!docs/superpowers/**' --glob '!docs/plans/**' .
```

Expected: no credential matches in app/teaching files.

- [ ] **Step 3: Confirm dropped surfaces**

```bash
rg -n "CatalogPage|/admin|powerbi-client|.agents/skills" --glob '!.git/**' --glob '!node_modules/**' --glob '!docs/**' .
```

Expected: no app-code matches.

- [ ] **Step 4: Run tests and dev server**

```bash
npm test
npm run dev
```

Open `/`. Confirm AE1 and AE2: four visuals + demo banner, no "Backlog by risk".

- [ ] **Step 5: Commit LICENSE if needed**

```bash
git add LICENSE
git commit -m "$(cat <<'EOF'
docs: add MIT license for the public teaching repo

EOF
)"
```

---

## Self-review

**Spec coverage:** R1–R13 each map to Tasks 2–7. Live chart stays off `main` (R8) and lives in `docs/talk/live-demo.md` (R9).

**Placeholder scan:** no TBD. Vega fallback encoding is specified. Package name is `fabric-app-demo`.

**Type consistency:** `backlogByRiskVegaSpec`, `backlogTable`, `fact_migration_backlog.risk` used the same way in the skill, live-demo doc, and schema.
