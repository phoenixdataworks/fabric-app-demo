# Change log

Document every non-trivial change from product and technical perspectives before the change is marked complete.

Cursor agents must follow `.cursor/rules/change-completion.mdc`.

## When to add a change doc

Add a change doc when you:

- Add or change a visual, KPI, or grid on Migration Pulse
- Change DAX queries, Vega specs, or schema grounding
- Change setup, wiring, warehouse SQL, or semantic model docs
- Refactor code that affects demo behavior or architecture

Skip a change doc for typo fixes, comment-only edits, or dependency bumps with no behavior change.

## File naming

Create one file per discrete change:

```text
docs/changes/YYYY-MM-DD-short-slug.md
```

Example: `docs/changes/2026-08-12-add-risk-donut.md`

Update an existing doc under `docs/` instead when the change belongs there (for example `GETTING_STARTED.md` for setup steps).

## Template

Copy this template into each new change doc:

```markdown
# [Short title]

**Date:** YYYY-MM-DD

## Product

- What changed for users or the demo audience
- Why the change matters for the talk or teaching goal

## Technical

- Files and modules touched
- DAX, schema, warehouse, or semantic model impact
- Setup or wiring changes (if any)

## Verification

- Tests and commands run
- Thermo-nuclear review outcome (pass, or findings deferred with reason)
```
