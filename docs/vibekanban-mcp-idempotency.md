# VibeKanban MCP 幂等创建规则

## 目标

确保通过 VibeKanban MCP 创建 issue 时，重复执行不会导致重复建单。

## 核心原则

- `task_id` 是元仓库内部稳定主键
- `issue_id` 是 VibeKanban 外部主键
- 所有创建动作都必须以 `task_id -> issue_id` 映射为准
- MCP 创建后必须立即回写映射
- 后续重跑时必须先查映射，不能盲目重建

---

## 需要持久化的信息

每个已同步任务建议至少记录：

- `task_id`
- `issue_id`
- `title`
- `create_status`
- `created_at`
- `updated_at`
- `execution_mode`
- `workspace_launchable`
- `parent_task_id`
- `depends_on_task_ids`
- `description_hash`
- `source_version`

推荐模板：`templates/issue-map.yaml`

---

## 幂等创建流程

### 步骤 1：加载输入

- issue batch
- issue 描述正文
- 现有 `issue-map.yaml`

### 步骤 2：按 `task_id` 检查映射

对每个准备创建的任务：

- 若 `task_id` 已存在且已有 `issue_id`，默认跳过创建
- 若 `task_id` 不存在或 `issue_id` 为空，允许创建

### 步骤 3：可选内容变更检查

若 `task_id` 已存在，但以下内容变化：

- `title`
- `execution_mode`
- `workspace_launchable`
- `description_hash`

则不重新创建，而应进入“更新 issue 描述/属性”的同步流程。

### 步骤 4：调用 MCP 创建

仅对未映射的 `task_id` 调用 MCP `create issue`。

### 步骤 5：立即回写映射

创建成功后必须立刻回写：

- `task_id -> issue_id`
- `create_status = created`
- `created_at`
- `updated_at`
- `description_hash`

### 步骤 6：失败记录

若创建失败，也应记录：

- `create_status = failed`
- 错误摘要
- 时间戳

避免重跑时无法分辨“没创建”还是“创建失败”。

---

## 重要约束

- 不允许按标题判断是否已创建
- 不允许只依赖 VibeKanban UI 目测判断
- 不允许在未回写映射前继续建立关系

---

## 与关系创建的关系

建立关系时也必须走映射：

- `parent_task_id -> parent issue_id`
- `depends_on_task_id -> dependency issue_id`
- `related_task_id -> related issue_id`

若映射缺失，不能稳定建关系，应先补齐映射。

---

## 推荐策略

默认策略：

- 先查映射
- 未创建才创建
- 已创建则跳过
- 内容变更则更新，不重建

这能保证 MCP 重跑时是幂等的。


## 推荐存放位置

推荐将 `issue-map.yaml` 的主副本放在业务仓库：

- `docs/meta/issue-map.yaml`

原因：

- 它与具体项目任务同步最紧密
- 新 workspace / agent 在业务仓库内更容易直接读取
- 避免元仓库与业务仓库对同一映射产生双主写入

元仓库侧可以保留索引或摘要，但不建议把元仓库当作唯一主副本。
