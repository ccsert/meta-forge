# 任务拆解模板

## 元信息

- Project ID: `{{project_id}}`
- Issue ID: `{{issue_id_or_tbd}}`
- Version: `v1`
- Generated At: `YYYY-MM-DD`

## Epic Tree

### Epic: `EPIC-001`
- Goal:
- Acceptance:
- Children:
  - `FEATURE-001`

### Feature: `FEATURE-001`
- Parent: `EPIC-001`
- Goal:
- Acceptance:
- Children:
  - `STORY-001`

### Story: `STORY-001`
- Parent: `FEATURE-001`
- Goal:
- Acceptance:
- Children:
  - `TASK-001`

### Task: `TASK-001`
- Parent: `STORY-001`
- Task ID: `TASK-001`
- Title:
- Execution Mode: executable
- Workspace Launchable: true
- Execution Reason: single-workspace implementation task
- Repo Scope:
- Workspace Scope: single-workspace
- Inputs:
  - docs/project-definition.md
  - docs/architecture/architecture-init.md
- Expected Outputs:
  - code changes
  - updated docs
- Acceptance Criteria:
  - [ ]
- DoD Profile: standard
- Execution Unit Check:
  - [ ] Goal is specific
  - [ ] Inputs are sufficient
  - [ ] Can be completed in one workspace
  - [ ] Can be verified independently
- Depends On:
  - `TASK-000`
- Blocked By: []
- Downstream Candidates: []
- Related To: []
- Spawned From: ""
- Merge Policy: agent-resolve
- Callback Policy: unlock-next-on-done
- Executor: CODEX
