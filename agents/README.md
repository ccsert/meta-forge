# Agent Topology

> 元仓库中的 agent 定义层。这里定义 agent 的职责、输入、输出、上下文边界与升级规则。

## 推荐拓扑

- `orchestrator-agent.md`
- `requirements-agent.md`
- `architecture-agent.md`
- `planning-agent.md`
- `execution-agent.md`
- `review-merge-agent.md`

## 原则

- agent 定义在元仓库统一维护
- agent 运行时主要在业务仓库 / workspace 执行
- agent 间交接以结构化产物为准，不以聊天记忆为准
- `Orchestrator Agent` 是唯一调度者

## 运行分层

### 元仓库负责
- 角色定义
- prompt / playbook / standards
- 输入输出协议
- 升级规则

### 业务仓库负责
- 实际代码
- 项目文档
- issue-map 主副本
- execution artifacts
- workspace 运行上下文


## 推荐入口

- `playbooks/orchestrator-agent-run.md`
- `playbooks/execution-agent-run.md`
- `playbooks/review-merge-agent-run.md`
