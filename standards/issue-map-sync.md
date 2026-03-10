# issue-map 多副本同步协议

> 定义元仓库草稿与业务仓库主副本之间的 issue-map 同步规则。

---

## 副本分布

| 位置 | 文件路径 | 定位 |
|------|----------|------|
| 元仓库 | `docs/meta/issue-map.draft.yaml` | 预同步草稿（pre-sync） |
| 业务仓库 | `docs/meta/issue-map.yaml` | 主副本（primary） |

---

## 生命周期

### Phase 1：草稿创建（元仓库）

在阶段 3（任务拆解）完成后，元仓库生成 `issue-map.draft.yaml`：

- 包含所有计划中的 `task_id`
- `issue_id` 字段为空
- `status: pending_sync`
- `sync_status: pre-sync`

### Phase 2：晋升为主副本（业务仓库）

在阶段 5（文档注入）时，将草稿注入业务仓库：

- 元仓库 `docs/meta/issue-map.draft.yaml` → 业务仓库 `docs/meta/issue-map.yaml`
- 此时业务仓库的副本成为主副本
- 标记 `sync_status: initialized`

### Phase 3：MCP 同步回写（业务仓库）

在阶段 6（VibeKanban 同步）时：

- 每次 MCP 创建 issue 成功后，回写到业务仓库主副本
- `issue_id` 填入实际值
- `status: created`
- `sync_status: synced`

### Phase 4：增量更新（业务仓库）

后续任务变更时：

- 新增任务：追加到主副本
- 描述变更：更新 `description_hash` 和 `updated_at`
- 状态变更：由 orchestrator 更新

---

## 同步规则

### 权威性

- **业务仓库主副本是唯一权威来源**
- 元仓库草稿仅用于初始规划阶段
- 一旦注入业务仓库，后续所有变更以业务仓库为准

### 元仓库草稿的更新

- 草稿在晋升后不再主动更新
- 若需重新规划，应从业务仓库主副本导出新状态
- 禁止在两个位置同时编辑

### 冲突处理

- 正常流程中不应出现冲突（单一写入源）
- 若因手动编辑导致分叉，以业务仓库主副本为准
- 元仓库草稿应重新从业务仓库同步

---

## 状态字段

### `sync_status`（文件级）

| 值 | 含义 |
|----|------|
| `pre-sync` | 草稿阶段，未注入业务仓库 |
| `initialized` | 已注入业务仓库，尚未开始 MCP 同步 |
| `syncing` | MCP 同步进行中 |
| `synced` | 所有节点已同步完成 |
| `partial` | 部分节点同步成功，部分失败 |

### `status`（每个 mapping 条目级）

| 值 | 含义 |
|----|------|
| `pending_sync` | 等待 MCP 创建 |
| `created` | MCP 创建成功 |
| `updated` | MCP 更新成功 |
| `failed` | MCP 操作失败 |

---

## 脚本支持

- `backfill-vibekanban-ids.mjs` — 回填 organization_id / project_id / repo_id
- `sync-task-breakdown-to-vibekanban.mjs` — 执行节点同步
- `sync-issue-relationships.mjs` — 执行关系同步
