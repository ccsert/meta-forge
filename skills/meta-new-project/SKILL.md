---
name: meta-new-project
description: >-
  Drive a new project from idea to meta-repo document baseline by producing
  `project-definition.md`, `architecture-init.md`, and `task-breakdown.md` in the
  correct order with human gates between stages. Use this skill whenever the user is
  starting a new project, refining an initial idea into a structured project in the
  meta-repo, or wants to complete stage 1-3 of the new-project flow before bootstrap
  and VibeKanban binding.
---

# Meta New Project

Use this skill for stage 1 to stage 3 of the meta-repo new-project workflow.

## What this skill does

- Transforms a raw idea into a structured project definition
- Produces the initial architecture document from the approved project definition
- Produces the initial task breakdown from the approved architecture
- Enforces the order of stage 1 -> stage 2 -> stage 3
- Keeps human gates visible between stages

## Trigger rule

Use this skill whenever any of the following is true:

- The user wants to start a new project from scratch
- The user has a new product idea and wants to formalize it in the meta-repo
- The user wants to generate `project-definition.md`, `architecture-init.md`, or `task-breakdown.md`
- The conversation is clearly about stage 1-3, not repo bootstrap or task execution

## Required reads

Read these before acting:

- `AI_ENTRYPOINT.md`
- `playbooks/new-project.md`
- `docs/ai-stage-routing.md`
- `standards/document-baseline.md`
- `templates/task-breakdown.md`

When working stage-by-stage, also read:

- `agents/requirements-agent.md`
- `agents/architecture-agent.md`
- `agents/planning-agent.md`

## Workflow

1. Use `scripts/check-new-project-docs.mjs` to detect which of stage 1-3 artifacts already exist
2. If `project-definition.md` is missing, stay in stage 1
3. If project definition exists but architecture is missing, stay in stage 2
4. If architecture exists but task breakdown is missing, stay in stage 3
5. Do not recommend bootstrap or execution until stage 1-3 outputs exist and the human gate is explicit

## Hard rules

- Do not skip directly from idea to task execution
- Do not generate architecture before project definition is stable
- Do not generate task breakdown before architecture exists
- Do not treat stage 1-3 as complete unless the corresponding documents exist
- Keep stage completion and human approval separate

## Scripts

- `scripts/check-new-project-docs.mjs`

## References

- `references/stage-1-3-flow.md`
