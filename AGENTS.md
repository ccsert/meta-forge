# AGENTS.md

## Project Skills

This repository defines project-local skills under `.agents/skills/`.
When working in this repository, prefer these project-local skills before falling back to global skills when the workflow matches.

### Available project-local skills
- `meta-stage-gate`: Determine the current project stage, output a stage snapshot, and prevent stage drift. (path: `.agents/skills/meta-stage-gate/SKILL.md`)
- `meta-task-description`: Render and validate VibeKanban issue descriptions against the meta-repo protocol. (path: `.agents/skills/meta-task-description/SKILL.md`)
- `meta-vibekanban-sync`: Resolve VibeKanban IDs, sync task nodes, sync relationships, and keep `issue-map` aligned. (path: `.agents/skills/meta-vibekanban-sync/SKILL.md`)
- `meta-project-bootstrap`: Create/bootstrap business repositories and inject core meta-repo documents. (path: `.agents/skills/meta-project-bootstrap/SKILL.md`)
- `meta-new-project`: Drive stage 1-3 of the new-project flow from idea to document baseline. (path: `.agents/skills/meta-new-project/SKILL.md`)

## Usage rule

- If a user request clearly matches one of the project-local skills above, use that skill for the turn.
- Prefer project-local skills for this repository because they encode the repository-specific workflow.
- Use global/system skills only when no project-local skill covers the request or when the user explicitly asks for them.
