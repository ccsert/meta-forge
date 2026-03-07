---
name: meta-vibekanban-sync
description: >-
  Bind a project to VibeKanban, resolve and backfill MCP IDs, sync task breakdown nodes
  into VibeKanban issues, and keep issue-map metadata aligned. Use this skill whenever
  the user mentions VibeKanban, MCP, organization_id, project_id, repo_id, issue sync,
  issue-map backfill, or wants to create/update Epic/Feature/Story/Task nodes from the
  meta-repo into VibeKanban.
---

# Meta VibeKanban Sync

Use this skill for the VibeKanban binding and issue synchronization workflow.

## What this skill does

- Resolves VibeKanban identifiers through MCP
- Decides which identifiers are safe to backfill at the current stage
- Syncs task-tree nodes into VibeKanban issues
- Updates issue descriptions and issue-map mappings
- Keeps relationship synchronization explicit and idempotent

## Trigger rule

Use this skill whenever any of the following is true:

- The user mentions `VibeKanban`, `MCP`, or `issue-map`
- The user asks to backfill `organization_id`, `project_id`, or `repo_id`
- The user asks to sync `task-breakdown` into issues
- The user asks to create or update Epic / Feature / Story / Task nodes in VibeKanban

## Required reads

Read these before acting:

- `playbooks/use-vibekanban-mcp.md`
- `docs/vibekanban-mcp-idempotency.md`
- `standards/task-relationship-model.md`
- `docs/meta/issue-map.draft.yaml`
- `docs/planning/task-breakdown.md`

If present, also inspect:

- `docs/meta/project-manifest.draft.yaml`
- `projects/registry.yaml`

## Workflow

1. Resolve identifiers through MCP list tools before using them
2. Backfill only the IDs that are valid for the current phase
3. Use `scripts/backfill-vibekanban-ids.mjs` to patch manifest and issue-map files
4. Use `scripts/sync-task-breakdown-to-vibekanban.mjs` to prepare node sync payloads
5. Use `scripts/sync-issue-relationships.mjs` to prepare relationship sync payloads
6. Update `issue-map` after successful create/update operations
7. Treat issue synchronization as partial until the intended node subset is fully mapped

## Hard rules

- Never invent VibeKanban IDs
- Do not backfill `repo_id` before repository binding exists
- Do not claim full task synchronization if only a seed subset is synced
- Do not treat issue descriptions as compliant unless they pass task-description validation
- Keep `issue-map` as the source of truth for local mapping state

## Scripts

- `scripts/backfill-vibekanban-ids.mjs`
- `scripts/sync-task-breakdown-to-vibekanban.mjs`
- `scripts/sync-issue-relationships.mjs`

## References

- `references/id-resolution.md`
