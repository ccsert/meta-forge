# AI 阶段路由

## 目标

帮助 AI 快速判断当前项目处于哪个阶段，以及下一步应该进入哪个 playbook。

## 路由规则

### Route A：项目定义缺失
条件：缺少 `project-definition.md`

下一步：
- 进入 `Requirements Agent`
- 读取 `playbooks/new-project.md`

### Route B：架构初始化缺失
条件：已有 `project-definition.md`，缺少 `architecture-init.md`

下一步：
- 进入 `Architecture Agent`
- 读取 `playbooks/new-project.md`

### Route C：任务拆解缺失
条件：已有架构文档，缺少 `task-breakdown.md`

下一步：
- 进入 `Planning Agent`
- 读取 `playbooks/new-project.md`

### Route D：MCP 同步未完成
条件：已有 `task-breakdown.md`，但 `issue-map.yaml` 缺失或 issue 未同步

下一步：
- 进入 `Orchestrator Agent`
- 读取 `playbooks/use-vibekanban-mcp.md`
- 读取 `playbooks/orchestrator-agent-run.md`

### Route E：存在 ready task
条件：已有 ready task，需要执行单个任务

下一步：
- 进入 `Execution Agent`
- 读取 `playbooks/execution-agent-run.md`

### Route F：任务已完成待复核/合并
条件：已有 `session-result.yaml`，需要 merge decision

下一步：
- 进入 `Review / Merge Agent`
- 读取 `playbooks/review-merge-agent-run.md`

### Route G：结果归档与下一任务编排
条件：需要判断下一个任务或归档运行结果

下一步：
- 进入 `Orchestrator Agent`
- 读取 `playbooks/orchestrate-next-task.md`
- 读取 `playbooks/orchestrator-agent-run.md`

### Route H：接入已有项目
条件：用户提到已有代码仓库需要纳管，或项目已有代码但缺少 meta-forge 标准文档

下一步：
- 触发 `meta-onboard-project` Skill
- 读取 `playbooks/onboard-existing-project.md`
- 读取 `standards/document-baseline.md`
