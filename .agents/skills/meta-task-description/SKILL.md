---
name: meta-task-description
description: >-
  Render and validate VibeKanban issue descriptions so they comply with this meta-repo's
  task description protocol. Use this skill whenever creating or updating executable tasks,
  checking whether a ready task description is compliant, syncing tasks into VibeKanban,
  or when the user asks whether a task description follows the meta-repo requirements.
---

# Meta Task Description

Use this skill to keep VibeKanban task descriptions structurally compliant.

## What this skill does

- Renders issue descriptions using the meta-repo task description structure
- Validates whether an issue description contains the required fields
- Distinguishes executable leaf tasks from container nodes like epic/feature/story
- Prevents ready-task descriptions from drifting into incomplete free-form summaries

## Trigger rule

Use this skill whenever either of the following is true:

- A VibeKanban issue is being created or updated for a task in this meta-repo
- The user asks whether a task description is compliant, complete, or ready for execution
- A task is being marked or treated as `workspace_launchable: true`

## Required reads

Read these before acting:

- `templates/vibekanban-issue-description.md`
- `standards/task-description-protocol.md`
- `standards/executable-task-policy.md`
- `standards/task-execution-unit.md`
- `docs/planning/task-breakdown.md`

## Workflow

1. Determine whether the node is `epic`, `feature`, `story`, or `task`
2. If executable, require the full execution classification and relationship fields
3. Run `scripts/render-vibekanban-description.mjs` to generate the structured description
4. Run `scripts/validate-issue-description.mjs` to check required fields
5. If validation fails, do not present the description as ready-task compliant

## Hard rules

- Any task intended for execution must include the required identity, execution, relationship, repo, input, goal, and acceptance fields
- Free-form summary descriptions are not sufficient for `workspace_launchable: true` tasks
- If required fields are missing, the task must be treated as non-compliant until corrected
- Relationship indexes in the description must remain aligned with `issue-map`

## Scripts

- `scripts/render-vibekanban-description.mjs`
- `scripts/validate-issue-description.mjs`

## References

- `references/required-fields.md`
