# meta-repo · AI 工程元仓库

> 本仓库是所有项目的**方法论基座**，沉淀提示词、技能、流程、规范与模板。
> 所有业务项目均由本仓库孵化，并在本仓库中统一管理。

---

## 这个仓库是什么

| 层级 | 内容 | 作用 |
|------|------|------|
| Playbooks | 流程剧本 | 做一件事的完整步骤 |
| Prompts | 提示词模板 | 驱动 Codex 思考与输出 |
| Skills | 技能卡 | 可执行操作能力说明 |
| Standards | 标准规范 | 定义什么叫做对了 |
| Templates | 文档模板 | 定义产物长什么样 |
| Generators | 项目生成器 | 新仓库初始化配置 |
| Projects | 项目注册表 | 管理所有业务仓库 |

---

## 快速入口

### 如果我是 AI 我先看哪里
→ 阅读 [AI Entrypoint](./AI_ENTRYPOINT.md)


### 我要创建一个新项目
→ 阅读 [新项目立项流程](./playbooks/new-project.md)

### 我要创建 VibeKanban 任务
→ 阅读 [批量创建 VibeKanban Issues](./playbooks/create-vibekanban-issues.md)

### 我要通过 MCP 同步到 VibeKanban
→ 阅读 [通过 VibeKanban MCP 执行任务同步](./playbooks/use-vibekanban-mcp.md)

### 我要理解 issue-map 幂等规则
→ 阅读 [VibeKanban MCP 幂等创建规则](./docs/vibekanban-mcp-idempotency.md)

### 我要运行 Orchestrator Agent
→ 阅读 [Orchestrator Agent 执行流](./playbooks/orchestrator-agent-run.md)

### 我要运行 Execution Agent
→ 阅读 [Execution Agent 执行流](./playbooks/execution-agent-run.md)

### 我要运行一个任务
→ 阅读 [运行单个任务](./playbooks/run-task.md)

### 我要运行 Review / Merge Agent
→ 阅读 [Review / Merge Agent 执行流](./playbooks/review-merge-agent-run.md)

### 我要编排下一个任务
→ 阅读 [编排下一个任务](./playbooks/orchestrate-next-task.md)

### 我要查看所有项目
→ 阅读 [项目注册表](./projects/registry.yaml)

### 我要了解整体运作模型
→ 阅读 [运作模型说明](./OPERATING_MODEL.md)

### 我要看完整操作清单
→ 阅读 [操作总检查单](./docs/operational-checklist.md)

### 我要了解自动化脚本接口
→ 阅读 [自动化脚本接口协议](./docs/script-interfaces.md)

### 我要查看 Agent 拓扑
→ 阅读 [Agent Topology](./agents/README.md)

### 我要了解 Node 自动化脚手架
→ 阅读 [Node 自动化脚手架](./docs/node-automation.md)

---

## 如何与 Codex 协作

1. 打开元仓库，找到对应场景的 **Playbook**
2. 按 Playbook 指引，加载对应的 **Prompts + Skills + Standards**
3. 与 Codex 对话，产出结构化输出
4. 人工确认关键节点
5. 通过 VibeKanban MCP 创建/更新任务
6. 在业务仓库中执行
7. 将经验回流到元仓库

---

## 上下文装配原则

> 不要把整个元仓库都喂给 Codex，按场景按需加载。

| 场景 | 加载内容 |
|------|----------|
| 需求分析 | prompts/analysis + standards/task-definition |
| 架构设计 | prompts/architecture + skills/architecture + standards/api + standards/db |
| 任务拆解 | prompts/planning + standards/task-definition + standards/dod |
| 编码执行 | prompts/implementation + skills/coding + skills/vibekanban + standards/coding |
| 代码审查 | prompts/review + standards/coding + standards/dod |

---

## 人工闸门

以下节点**必须人工确认**后才能继续：

- [ ] 项目定义完成
- [ ] 架构方案完成
- [ ] 任务拆分完成
- [ ] 高风险改动执行前
- [ ] 发布前

---

## 版本说明

当前版本：`v0.1.0`
最后更新：见 [changelog](./docs/changelog.md)
