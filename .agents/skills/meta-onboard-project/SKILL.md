---
name: meta-onboard-project
description: >-
  Onboard an existing code repository into meta-forge management by producing an
  audit report, backfilling standard documents (project-definition, architecture,
  task-breakdown), registering in the project registry, and optionally binding to
  VibeKanban. Use this skill whenever the user wants to bring an existing project
  under meta-forge management, import a legacy codebase, or onboard a historical
  project that already has code but lacks meta-forge documentation.
---

# Meta Onboard Project

Use this skill to onboard an existing project into meta-forge (stages O1-O6).

## What this skill does

- Audits an existing codebase to understand structure, tech stack, and architecture
- Generates a structured audit report (onboard-audit.md)
- Backfills meta-forge standard documents from existing code (project-definition, architecture-init, task-breakdown)
- Registers the project in the meta-forge registry
- Optionally binds to VibeKanban with existing tasks marked as done
- Brings the project to the same managed state as a new project that completed stage 1-7

## Trigger rule

Use this skill whenever any of the following is true:

- The user wants to onboard an existing project into meta-forge
- The user mentions importing, migrating, or connecting a legacy/historical project
- The user has a codebase that already exists and wants meta-forge to manage it
- The user says "接入老项目", "导入项目", "已有项目", "历史项目", "onboard"
- The conversation is about a project with existing code that needs meta-forge documentation

## Required reads

Read these before acting:

- `AI_ENTRYPOINT.md`
- `playbooks/onboard-existing-project.md`
- `standards/document-baseline.md`
- `standards/project-registry-schema.md`
- `templates/project-definition.md`
- `templates/task-breakdown.md`

When working stage-by-stage, also read:

- `agents/requirements-agent.md` (for project-definition backfill)
- `agents/architecture-agent.md` (for architecture backfill)
- `agents/planning-agent.md` (for task breakdown)

## Workflow

1. Confirm the target repository path or URL
2. Execute stage O1: scan the codebase, generate `docs/meta/onboard-audit.md`
3. Wait for human confirmation of the audit report
4. Execute stage O2: backfill `project-definition.md`, `architecture-init.md`, ADRs
5. Wait for human confirmation of each backfilled document
6. Execute stage O3: generate `task-breakdown.md` with done/in-progress/ready status
7. Wait for human confirmation of the task tree
8. Execute stage O4: register in `projects/registry.yaml` with `playbook: onboard-existing`
9. Optionally execute stage O5: bind to VibeKanban using `meta-vibekanban-sync`
10. Verify readiness with `node scripts/meta-cli.mjs stage --project <id>`

## Hard rules

- Do not skip the audit phase — understanding the codebase is the foundation
- Do not backfill documents without the audit report being confirmed first
- Do not register in registry before documents exist
- Do not claim onboarding is complete until document baseline is satisfied
- Mark completed work as done in task-breakdown — do not pretend everything is new
- Keep human gates between O1, O2, O3 stages
- Do not modify existing code during onboarding — only generate documentation

## Key differences from new-project

- Direction is reversed: code → docs → management (not idea → docs → code)
- Architecture is inferred from code, not designed from requirements
- Tasks include existing done work, not just future work
- Repository already exists — skip creation
- Registry uses `playbook: onboard-existing` instead of `new-project`

## Scripts

- `node scripts/meta-cli.mjs stage --project <id>` (verify readiness after O4)
- `node scripts/meta-cli.mjs status --project <id>` (dashboard after O6)

## References

- `playbooks/onboard-existing-project.md`
- `standards/document-baseline.md`
