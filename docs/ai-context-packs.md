# AI 最小上下文包

## 目标

为不同阶段的 AI 指定“最小必读集”，避免每次加载整个元仓库。

## 1. 新项目阶段

### Requirements Agent 最小包
- `AI_ENTRYPOINT.md`
- `playbooks/new-project.md`
- `agents/requirements-agent.md`
- `prompts/analysis/requirements-analysis.md`
- `templates/project-definition.md`
- `templates/project-manifest.yaml`

### Architecture Agent 最小包
- `AI_ENTRYPOINT.md`
- `playbooks/new-project.md`
- `agents/architecture-agent.md`
- `prompts/architecture/system-architecture.md`
- `templates/tech-design.md`
- `templates/adr.md`
- `standards/document-baseline.md`

### Planning Agent 最小包
- `AI_ENTRYPOINT.md`
- `playbooks/new-project.md`
- `agents/planning-agent.md`
- `prompts/planning/task-breakdown.md`
- `standards/task-execution-unit.md`
- `standards/task-relationship-model.md`
- `templates/task-breakdown.md`

## 2. MCP 同步阶段

### Orchestrator Agent 最小包
- `AI_ENTRYPOINT.md`
- `agents/orchestrator-agent.md`
- `playbooks/orchestrator-agent-run.md`
- `playbooks/use-vibekanban-mcp.md`
- `docs/vibekanban-mcp-idempotency.md`
- `docs/vibekanban-mcp-tools.md`
- `standards/issue-map-sync.md`
- `templates/issue-map.yaml`

## 3. 执行阶段

### Execution Agent 最小包
- `AI_ENTRYPOINT.md`
- `agents/execution-agent.md`
- `playbooks/execution-agent-run.md`
- `playbooks/pre-task-sync.md`
- `prompts/implementation/coding-execution.md`
- `standards/coding.md`
- `standards/dod.md`
- `standards/agent-handoff.md`
- `templates/session-result.yaml`
- `templates/task-execution-summary.md`
- 当前任务文档输入
- 当前依赖任务摘要

## 4. Review / Merge 阶段

### Review / Merge Agent 最小包
- `AI_ENTRYPOINT.md`
- `agents/review-merge-agent.md`
- `playbooks/review-merge-agent-run.md`
- `playbooks/merge-workspace.md`
- `prompts/review/code-review.md`
- `standards/coding.md`
- `standards/merge-policy.md`
- `standards/dod.md`
- `standards/agent-handoff.md`
- 当前 `session-result.yaml`
- 当前执行摘要

## 5. 编排阶段

### Orchestrator Agent 编排包
- `AI_ENTRYPOINT.md`
- `agents/orchestrator-agent.md`
- `playbooks/orchestrator-agent-run.md`
- `playbooks/orchestrate-next-task.md`
- `playbooks/experience-feedback.md`
- `docs/session-orchestration.md`
- `standards/agent-handoff.md`
- ready task selection
- issue-map
- runs 摘要

## 规则

- 先加载最小包，再按需要追加
- 不允许默认加载整个元仓库
- 当前阶段结束后，清理无关上下文，再进入下一个阶段
