# VibeKanban MCP 工具参考

> 定义 AI agent 在调用 VibeKanban MCP 时应使用的工具名称、参数结构与响应格式。

---

## 概述

VibeKanban MCP 是元仓库与 VibeKanban 任务管理系统之间的桥梁。所有 issue 的创建、更新、关系建立都必须通过 MCP 工具执行，不允许手动创建。

---

## 工具发现

在调用 VibeKanban MCP 工具前，应先通过工具搜索确认可用工具：

```
搜索模式：vibekanban
```

实际 MCP 工具名称取决于运行环境中的 MCP 服务器配置。常见前缀为 `mcp_vibekanban_`。

---

## 核心操作

### 1. 查询组织信息

**目的**：获取 `organization_id`

**参数**：无或按组织名查询

**响应**：
```json
{
  "organization_id": "uuid",
  "name": "组织名称"
}
```

---

### 2. 查询项目信息

**目的**：获取 `project_id`、`board_id`

**参数**：
- `organization_id`: 组织 ID

**响应**：
```json
{
  "project_id": "uuid",
  "name": "项目名称",
  "board_id": "uuid"
}
```

---

### 3. 查询仓库信息

**目的**：获取 `repo_id`

**参数**：
- `organization_id`: 组织 ID
- 仓库名称或 URL

**响应**：
```json
{
  "repo_id": "uuid",
  "name": "仓库名称",
  "url": "https://github.com/..."
}
```

---

### 4. 创建 Issue

**目的**：从 task 创建 VibeKanban issue

**参数**：
- `project_id`: 项目 ID
- `title`: Issue 标题
- `description`: Issue 描述正文（Markdown）
- `type`: issue 类型（epic / feature / story / task / bug）
- `status`: 初始状态（通常为 backlog 或 todo）
- `repo_id`: 关联仓库 ID（可选）

**响应**：
```json
{
  "issue_id": "uuid",
  "title": "...",
  "status": "backlog"
}
```

**回写要求**：创建成功后必须立即回写 `issue-map.yaml` 中的 `task_id -> issue_id` 映射。

---

### 5. 更新 Issue

**目的**：更新已有 issue 的描述、状态或属性

**参数**：
- `issue_id`: Issue ID
- `title`: 新标题（可选）
- `description`: 新描述（可选）
- `status`: 新状态（可选）

**响应**：
```json
{
  "issue_id": "uuid",
  "updated": true
}
```

---

### 6. 建立关系

**目的**：建立两个 issue 之间的关系

**参数**：
- `source_issue_id`: 源 Issue ID
- `target_issue_id`: 目标 Issue ID
- `relation_type`: 关系类型

**关系类型枚举**：
- `parent_of` — 结构分解关系
- `depends_on` — 执行前置依赖
- `blocks` — 显式阻塞
- `relates_to` — 信息关联
- `spawned_from` — 补偿性任务来源

**响应**：
```json
{
  "relation_id": "uuid",
  "source": "issue_id_1",
  "target": "issue_id_2",
  "type": "depends_on"
}
```

**约束**：
- 必须在两个 issue 都已创建并回写映射后才能建立关系
- 不允许未映射就直接建关系

---

### 7. 查询 Issue 状态

**目的**：获取 issue 当前状态

**参数**：
- `issue_id`: Issue ID

**响应**：
```json
{
  "issue_id": "uuid",
  "status": "in_progress",
  "title": "...",
  "updated_at": "2026-03-10T..."
}
```

---

## 调用约束

1. **MCP 是唯一正式写入口** — 不允许通过 UI 手动创建然后补映射
2. **每次创建后必须立即回写映射** — 参考 `docs/vibekanban-mcp-idempotency.md`
3. **关系建立必须在节点同步之后** — 所有任务节点创建完成且映射回写后，再批量建立关系
4. **幂等性** — 重跑时先查 `issue-map.yaml`，已存在的 `task_id -> issue_id` 跳过创建
5. **失败记录** — MCP 调用失败时记录 `create_status = failed` 和错误摘要

---

## 常见错误处理

| 错误场景 | 处理方式 |
|----------|----------|
| `organization_id` 无法获取 | 停止，要求人工提供 |
| `project_id` 不存在 | 先在 VibeKanban 中创建项目 |
| Issue 创建失败 | 记录失败状态，不继续建关系 |
| 关系建立失败（任一 issue 不存在） | 跳过该关系，记录到同步摘要 |
| 网络超时 | 重试一次，仍失败则标记 failed |

---

## 与元仓库工具链的关系

```
generate-issue-batch → render-issue-description → MCP 创建 → 回写 issue-map
                                                  MCP 建关系 → 回写关系状态
```

- `generate-issue-batch`：生成 batch 清单（本地脚本）
- `render-issue-description`：渲染 issue 描述正文（本地脚本）
- MCP：执行实际写入动作
- `issue-map.yaml`：持久化映射结果
