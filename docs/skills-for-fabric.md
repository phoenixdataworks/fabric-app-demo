# Skills for Fabric (official)

Microsoft publishes reusable AI-assistant instructions for Fabric workloads in [microsoft/skills-for-fabric](https://github.com/microsoft/skills-for-fabric).

Docs: [Overview](https://learn.microsoft.com/en-us/fabric/fundamentals/skills-for-fabric-overview) · [Install](https://learn.microsoft.com/en-us/fabric/fundamentals/skills-for-fabric-install) · [Discover skills](https://learn.microsoft.com/en-us/fabric/fundamentals/skills-for-fabric-discover)

## What it is

Skills teach an AI coding tool **what to do** with Fabric: REST APIs, T-SQL, DAX, KQL, Spark patterns, and operational habits.

MCP servers **do it**: live tool access to data and APIs. Skills and MCP work best together. This demo repo does not install Fabric MCP servers.

## Install for Cursor (show in the talk)

From this repo:

```bash
npm run skills:install
```

That clones [microsoft/skills-for-fabric](https://github.com/microsoft/skills-for-fabric) to `../skills-for-fabric` (override with `SKILLS_FOR_FABRIC_DIR`).

**In Cursor:**

1. Open this repo (`fabric-app-demo`).
2. **File → Add Folder to Workspace** → select `skills-for-fabric`.
3. Point at `.cursorrules`, `AGENTS.md`, or any file under `skills/` when explaining the catalog.

**On stage (2–3 min):**

- Show `.cursorrules` — platform-wide rules (warehouse, Spark, KQL, semantic models, PBIP).
- Show `skills/semantic-model-authoring/` or `skills/sqldw-consumption-cli/` — one official skill folder.
- Show `agents/FabricAppDev.agent.md` — note it targets **Python + ODBC/XMLA**, not Rayfin TypeScript apps.
- Contrast with `.cursor/skills/modify-fabric-data-app/` in **this** repo — the gap we filled.

Copilot CLI / Claude Code use the plugin marketplace instead:

```text
/plugin marketplace add microsoft/skills-for-fabric
/plugin install fabric-skills@fabric-collection
/plugin install powerbi-authoring@fabric-collection
```

## Bundles

| Bundle | Use it for |
|--------|------------|
| `fabric-skills` | Full platform set. Does **not** include Power BI report authoring. |
| `fabric-authoring` | REST, notebooks, T-SQL, KQL, Dataflows, Eventstreams, semantic models |
| `fabric-consumption` | Read-only query and discovery |
| `fabric-operations` | Warehouse/Spark diagnostics |
| `powerbi-authoring` | Separate plug-in: semantic models, PBIP, report plan/design/author/manage |

Live operations typically need `az login` and a Fabric token.

## What it covers well

Warehouse, Lakehouse/Spark, Eventhouse/KQL, Eventstreams, Activator, Dataflows Gen2, catalog search, Git integration, deployment pipelines, semantic model authoring, Power BI PBIP, migrations.

Experimental agents in `agents/`: `FabricDataEngineer`, `FabricAdmin`, `FabricIQ`, `FabricMigrationEngineer`, `FabricAppDev`.

## The gap this repo fills

`FabricAppDev` builds Python apps over ODBC / XMLA / REST. The official [Dashboard app example](https://github.com/microsoft/skills-for-fabric/blob/main/prompt_examples/DashboardApp.txt) is a Python dashboard against a warehouse — not a [Fabric Data App](https://learn.microsoft.com/en-us/fabric/apps/overview).

There is no official skill for modifying a **Rayfin / TypeScript Fabric Data App** (Vega visuals, `rayfin/data`, schema-grounded page changes). This repo ships `.cursor/skills/modify-fabric-data-app/` for that.

**Use both:**

- skills-for-fabric → platform (warehouse, semantic model, PBIP, Git)
- modify-fabric-data-app → this app's React + Rayfin layer

## Do not vendor the whole catalog here

Copying all of `skills-for-fabric` into this repo would bury the one-skill lesson and imply Fabric credentials are required to learn. Clone beside the repo and add to the workspace instead.
