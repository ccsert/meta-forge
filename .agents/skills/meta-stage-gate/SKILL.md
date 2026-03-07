---
name: meta-stage-gate
description: >-
  Determine the current project stage in this meta-repo, output a stage snapshot,
  and enforce stage boundaries before any next-step recommendation. Use this skill
  whenever the user asks things like "我们到哪一步了", "下一步是什么",
  "现在能不能开始执行", "阶段是否完成", or whenever the conversation is
  happening inside the meta-repo and there is any risk of jumping from planning,
  bootstrap, or VibeKanban sync directly into business-code execution.
---

# Meta Stage Gate

Use this skill to prevent stage drift inside the meta-repo.

## What this skill does

- Identifies the current lifecycle stage for the active project
- Distinguishes `completed`, `partial`, and `pending` progress
- States allowed actions and forbidden actions for the current stage
- Points to the exact next playbook step instead of letting execution drift

## Trigger rule

Use this skill whenever either of the following is true:

- The user asks about current progress, next step, whether execution can start, or whether a stage is finished
- The conversation is still in the meta-repo and the assistant is about to recommend business implementation, workspace execution, or direct coding work

## Required reads

Read these before answering:

- `AI_ENTRYPOINT.md`
- `docs/ai-stage-routing.md`
- `playbooks/new-project.md`
- `standards/document-baseline.md`

If present for the active project, also inspect:

- `docs/project-definition.md`
- `docs/architecture/architecture-init.md`
- `docs/planning/task-breakdown.md`
- `docs/meta/project-manifest.draft.yaml`
- `docs/meta/issue-map.draft.yaml`

## Workflow

1. Run `scripts/check-stage-ready.mjs` to inspect document and binding readiness
2. Run `scripts/snapshot-stage-status.mjs` to produce a compact stage snapshot
3. Answer using the snapshot, not by intuition
4. Explicitly separate:
   - completed work
   - partial work
   - pending work
   - allowed next actions
   - forbidden next actions

## Hard rules

- If still inside `new-project` flow, do not default to business-code execution
- If a human gate is still pending, do not recommend crossing the stage boundary as if it were already approved
- If issue synchronization is partial, do not state that iteration execution has fully started
- If repository/bootstrap/binding work is incomplete, say so directly with no optimistic shortcutting

## Output shape

Prefer a compact status update with:

- `Current Stage`
- `Completed`
- `Partial`
- `Pending`
- `Allowed Next Actions`
- `Forbidden Actions`
- `Next Playbook Step`

## Scripts

- `scripts/check-stage-ready.mjs`
- `scripts/snapshot-stage-status.mjs`

## References

- `references/stage-routing.md`
