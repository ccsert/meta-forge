# AI Entrypoint

> 如果你是进入本仓库执行任务的 AI，请先从这里开始，不要直接遍历整个仓库。

## 你的目标

本仓库是一个 **AI 原生工程元仓库**。

你的职责不是盲目读完所有文件，而是：

1. 识别当前阶段
2. 加载当前阶段的最小必读集
3. 按 playbook 执行
4. 输出结构化结果
5. 在需要时转交下一个 agent 或进入人工闸门

---

## 第一原则

- 不要默认读取整个仓库
- 不要用长聊天记忆代替结构化文件
- 不要跳过 playbook
- 不要跳过人工闸门
- 不要同时处理多个无关任务

---

## 第一步：识别你当前处于哪个阶段

按以下顺序判断：

### 1. 新项目阶段
如果缺少以下任一核心文档：
- `project-definition.md`
- `architecture-init.md`
- `task-breakdown.md`

则优先进入新项目流程。

读取：
- `playbooks/new-project.md`
- `docs/ai-stage-routing.md`
- `docs/ai-context-packs.md`

### 2. MCP 同步阶段
如果已经有 `task-breakdown.md`，但尚未完成 issue 同步或 `issue-map.yaml` 不完整。

读取：
- `playbooks/use-vibekanban-mcp.md`
- `docs/vibekanban-mcp-idempotency.md`
- `docs/ai-context-packs.md`

### 3. 任务执行阶段
如果已经存在 ready task，且当前目标是完成单个任务。

读取：
- `playbooks/execution-agent-run.md`
- `playbooks/pre-task-sync.md`
- `docs/ai-context-packs.md`

### 4. Review / Merge 阶段
如果当前任务已完成，目标是复核、合并、冲突分流。

读取：
- `playbooks/review-merge-agent-run.md`
- `playbooks/merge-workspace.md`
- `docs/ai-context-packs.md`

### 5. Orchestrator 阶段
如果当前目标是编排整体流程、筛选 ready task、转交其他 agent。

读取：
- `playbooks/orchestrator-agent-run.md`
- `playbooks/orchestrate-next-task.md`
- `docs/ai-context-packs.md`

---

## 第二步：选择你的角色

根据当前目标选择一个角色：

- `Requirements Agent`
- `Architecture Agent`
- `Planning Agent`
- `Orchestrator Agent`
- `Execution Agent`
- `Review / Merge Agent`

角色定义见：
- `agents/README.md`

---

## 第三步：只加载最小必读集

不要加载整个仓库，只加载当前阶段对应的最小上下文包。

读取：
- `docs/ai-context-packs.md`

---

## 第四步：按结构化产物交接

上游交给下游的，优先应是：

- `project-definition.md`
- `architecture-init.md`
- `task-breakdown.md`
- `issue-map.yaml`
- `session-result.yaml`
- `docs/execution/<task-id>.md`
- `runs/` 中的执行快照

不要优先依赖：

- 旧聊天历史
- 模糊口头说明
- 人工未固化的隐式约定

---

## 第五步：遇到不确定性时如何处理

先按这个顺序判断：

1. 文档 / ADR 是否已覆盖
2. playbook 是否已给出明确流程
3. 是否属于低风险默认策略
4. 是否触发人工闸门

若涉及：
- 架构边界
- 接口契约
- 数据模型
- 安全 / 权限 / 合规
- 高风险 merge 冲突

则必须升级，而不是擅自继续。

---

## 最小操作顺序

如果你不确定从哪里开始，按这个顺序：

1. 读 `AI_ENTRYPOINT.md`
2. 读 `docs/ai-stage-routing.md`
3. 选定当前 agent 角色
4. 读 `docs/ai-context-packs.md`
5. 只加载当前阶段最小必读文件
6. 按对应 playbook 执行
