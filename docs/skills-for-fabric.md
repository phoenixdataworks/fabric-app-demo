# Skills for Fabric (official)

Microsoft publishes reusable AI-assistant instructions for Fabric workloads in [microsoft/skills-for-fabric](https://github.com/microsoft/skills-for-fabric).

Docs: [Overview](https://learn.microsoft.com/en-us/fabric/fundamentals/skills-for-fabric-overview) · [Install](https://learn.microsoft.com/en-us/fabric/fundamentals/skills-for-fabric-install) · [Discover skills](https://learn.microsoft.com/en-us/fabric/fundamentals/skills-for-fabric-discover)

## What it is

Skills teach an AI coding tool **what to do** with Fabric: REST APIs, T-SQL, DAX, KQL, Spark patterns, and operational habits.

**This repo's Data App layer** is separate: start with [docs/GETTING_STARTED.md](GETTING_STARTED.md) and `.cursor/skills/modify-fabric-data-app/` for the live React + DAX path.

MCP servers **do it**: live tool access to data and APIs. Skills and MCP work best together. This demo repo does not install Fabric MCP servers.

## Install for Cursor

Use the [skills CLI](https://github.com/vercel-labs/skills) (`npx skills add`). Control scope with `-g` / `--global`.

| Scope | Flag | Location (Cursor) | When to use |
|-------|------|-------------------|-------------|
| **Current project** (CLI default) | none | `.agents/skills/` or `.cursor/skills/` | Skills shared with the team. Commit the folders. |
| **Global / User** | `-g` or `--global` | `~/.agents/skills/` or `~/.cursor/skills/` | Personal skills available in every project on your machine. |

### Commands

**Install to the current project** (default):

```bash
npx skills add microsoft/skills-for-fabric -a cursor -y
```

**Install globally** (recommended for the full catalog in this teaching repo):

```bash
npx skills add microsoft/skills-for-fabric -a cursor -g -y
```

Install one skill:

```bash
npx skills add microsoft/skills-for-fabric --skill semantic-model-authoring -a cursor -g -y
```

### After install

- Project skills appear only when you open that project in Cursor.
- Global skills appear in every project.
- Restart the Cursor agent session or open a new chat for skills to load.
- List what is installed: `npx skills list` (add `-g` to see only global).

### Recommendation

- Use **project scope** for skills that belong to a specific codebase or team workflow.
- Use **global scope** for the full `fabric-skills` catalog so you do not commit 31 skill folders into this teaching repo.
- Keep **modify-fabric-data-app** in this repo at `.cursor/skills/modify-fabric-data-app/` for the React Data App layer.

**On stage (2–3 min):**

- Run `npx skills list -g` — show installed Fabric skills.
- Open one global skill (for example `~/.agents/skills/semantic-model-authoring/SKILL.md`).
- Contrast with `.cursor/skills/modify-fabric-data-app/` in **this** repo — the read-only React Fabric Data App layer.

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

There is no official skill for modifying a **read-only React Fabric Data App** (Vega visuals, schema-grounded page changes). This repo ships `.cursor/skills/modify-fabric-data-app/` for that.

**Use both:**

- skills-for-fabric → platform (warehouse, semantic model, PBIP, Git)
- modify-fabric-data-app → this app's React read-only layer

## Do not vendor the whole catalog here

Copying all of `skills-for-fabric` into this repo would bury the one-skill lesson and imply Fabric credentials are required to learn. Install with `npx skills add ... -g` for the full catalog, or install selected skills to the project and commit only what the team needs.
