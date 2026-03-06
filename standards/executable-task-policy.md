# 可执行任务标识策略

## 目标

明确区分：

- 哪些 VibeKanban 任务只是管理/规划/文档节点
- 哪些任务可以被 agent 拉起为独立 workspace session 执行

核心要求是：**可执行性必须显式标识，不能靠 agent 猜。**

---

## 核心字段

建议每个任务都明确记录以下字段：

- `execution_mode`
- `workspace_launchable`
- `execution_reason`

### 字段语义

#### `execution_mode`
表示任务类型在执行编排中的角色。

可选值建议：

- `non-executable`
- `documentation`
- `decision`
- `planning`
- `executable`

说明：

- `non-executable`：纯管理/汇总节点，不进入 workspace
- `documentation`：文档补齐任务，通常不进入编码 workspace，除非明确需要文档执行 session
- `decision`：需要人或架构决策的任务，不自动执行
- `planning`：拆解、梳理、映射类任务，不自动执行
- `executable`：可进入独立 workspace 执行的任务

#### `workspace_launchable`
表示当前任务是否允许直接启动 `start_workspace_session`。

可选值：

- `true`
- `false`

#### `execution_reason`
说明为什么该任务可执行或不可执行。

示例：

- `single-workspace implementation task`
- `epic container only`
- `needs ADR before coding`
- `documentation baseline missing`
- `cross-cutting task needs further split`

---

## 默认规则

### 默认不可执行的任务

以下任务默认 `workspace_launchable: false`：

- Epic
- 大 Feature 汇总任务
- 纯需求澄清任务
- 架构决策任务
- ADR 讨论任务
- 跨多个模块、无法单 workspace 闭环的任务
- 缺少文档输入的任务

### 默认可执行的任务

以下任务可考虑 `workspace_launchable: true`：

- 单 workspace 可闭环的开发任务
- 可独立验证的缺陷修复任务
- 低风险边界清晰的重构任务
- 明确输入输出的文档实现任务

---

## 启动规则

只有同时满足以下条件，任务才允许启动 workspace：

- `execution_mode = executable`
- `workspace_launchable = true`
- 通过执行单元检查
- 文档输入齐全
- `depends_on` 已满足
- 无未决人工闸门

若任一条件不满足，则不能启动 workspace。

---

## 推荐判断顺序

agent 或 orchestrator 在准备启动任务时，按以下顺序判断：

1. 任务是否显式标记为 `executable`
2. `workspace_launchable` 是否为 `true`
3. 任务描述中的关系索引是否完整
4. 文档输入是否齐全
5. 上游依赖是否完成
6. 是否存在人工闸门

---

## 与 VibeKanban 的关系

- VibeKanban 可以存放所有类型的任务
- 但只有 `workspace_launchable: true` 的任务能进入执行队列
- 这意味着“在板上”不等于“可启动 session”

---

## 最佳实践

- 在任务创建时就写明可执行性，而不是运行时再推断
- 父级任务通常只承担组织与追踪职责
- 真正进入 agent workspace 的，应该是叶子级、边界明确的执行任务
