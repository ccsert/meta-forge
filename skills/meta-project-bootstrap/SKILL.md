---
name: meta-project-bootstrap
description: >-
  Create and bootstrap a business repository from the meta-repo: collect repository
  coordinates, create the GitHub repository, initialize the local repo, inject core
  design documents, and create manifest and issue-map primary copies. Use this skill
  whenever the user wants to create a new business repository, inject meta-repo docs,
  bootstrap a project after stage 1-3 are complete, or asks to perform stage 4/5 of
  the new-project flow.
---

# Meta Project Bootstrap

Use this skill for stage 4 and stage 5 of the new-project workflow.

## What this skill does

- Confirms the repository coordinates needed for bootstrap
- Creates or verifies the GitHub repository
- Initializes the local business repository
- Injects core project-definition, architecture, planning, manifest, and issue-map files
- Leaves the project in a state ready for VibeKanban binding

## Trigger rule

Use this skill whenever any of the following is true:

- The user asks to create the business repository
- The user asks to inject meta-repo documents into a new repo
- The project has completed stage 1-3 and needs stage 4/5 execution
- The user asks to bootstrap a repo from the meta-repo outputs

## Required reads

Read these before acting:

- `playbooks/new-project.md`
- `docs/meta/new-project-gate-checklist.md`
- `docs/meta/project-manifest.draft.yaml`
- `docs/meta/issue-map.draft.yaml`
- `docs/meta/stage-4-5-execution-checklist.md`

## Workflow

1. Confirm that stage 1-3 artifacts exist
2. Confirm `github_owner`, `github_name`, `visibility`, `default_branch`, and `local_path`
3. Use `scripts/bootstrap-business-repo.mjs` to generate the concrete bootstrap plan
4. Use `scripts/inject-meta-docs.mjs` to generate the document injection plan
5. Execute creation and injection actions only after the repository coordinates are confirmed
6. Verify that the business repo contains the expected document baseline

## Hard rules

- Do not bootstrap a business repo before stage 1-3 artifacts exist
- Do not claim stage 5 is complete until manifest and issue-map primary copies exist in the business repo
- Do not enter task execution directly from bootstrap
- Treat bootstrap and VibeKanban binding as separate steps

## Scripts

- `scripts/bootstrap-business-repo.mjs`
- `scripts/inject-meta-docs.mjs`

## References

- `references/bootstrap-checklist.md`
