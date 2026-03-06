# 自动化脚本接口协议

> 定义元仓库第一批自动化脚本的职责边界、输入输出、错误语义与调用位置。

## 目标

当前不直接实现重型自动化平台，而是先定义 3 个最小可用脚本：

- `generate-issue-batch`
- `render-issue-description`
- `archive-session-result`

它们共同构成第一版“半自动化执行层”。

---

## 统一约定

### 调用方式

建议统一采用 CLI 形式：

```bash
<command> --input <file> --output <file>
```

按脚本需要可增加其他参数。

### 通用原则

- 一个脚本只做一件事
- 先校验输入，再写输出
- 输出文件必须是完整结果，不写半成品
- 失败时返回非 `0` 退出码
- 错误输出要能定位到具体字段或步骤

### 错误分层

建议统一错误类别：

- `INPUT_ERROR`：输入文件缺失或格式不合法
- `VALIDATION_ERROR`：字段不满足协议
- `RENDER_ERROR`：模板渲染失败
- `STATE_ERROR`：当前状态不允许执行
- `WRITE_ERROR`：输出文件写入失败

---

## 1. `generate-issue-batch`

### 目标

把项目任务拆解文档转换为机器可读的 issue 批量创建清单。

### 典型调用

```bash
generate-issue-batch \
  --task-breakdown docs/planning/task-breakdown.md \
  --manifest docs/meta/project-manifest.yaml \
  --output .meta/vibekanban-issue-batch.yaml
```

### 输入

- `docs/planning/task-breakdown.md`
- `docs/meta/project-manifest.yaml`

### 输出

- `templates/vibekanban-issue-batch.yaml` 对应结构的实际实例

### 最低输入要求

每个任务至少具备：

- `Task ID`
- `Title`
- `Execution Mode`
- `Workspace Launchable`
- `Execution Reason`
- `Parent`
- `Depends On`
- `Repo Scope`
- `Acceptance Criteria`

### 最低输出要求

每个 issue 条目至少生成：

- `task_id`
- `title`
- `task_type`
- `execution_mode`
- `workspace_launchable`
- `execution_reason`
- `parent_task_id`
- `depends_on_task_ids`
- `blocked_by_task_ids`
- `related_task_ids`
- `spawned_from_task_id`
- `repo_scope`
- `doc_inputs`
- `acceptance_criteria`

### 失败场景

- 缺少稳定 `Task ID`
- 缺少可执行性字段
- `workspace_launchable = true` 但缺少文档输入
- 关系字段无法解析

### 调用位置

- `playbooks/create-vibekanban-issues.md`

---

## 2. `render-issue-description`

### 目标

把 batch 条目渲染为符合协议的 VibeKanban issue 描述正文。

### 典型调用

```bash
render-issue-description \
  --batch .meta/vibekanban-issue-batch.yaml \
  --task-id TASK-001 \
  --template templates/vibekanban-issue-description.md \
  --output .meta/descriptions/TASK-001.md
```

### 输入

- batch 文件中的单个 issue 条目
- `templates/vibekanban-issue-description.md`

### 输出

- 单个 issue 的 Markdown 描述正文

### 最低渲染字段

- `Task ID`
- `Project ID`
- `Issue ID` 或占位值
- `Execution Mode`
- `Workspace Launchable`
- `Execution Reason`
- `Depends On`
- `Blocked By`
- `Related Tasks`
- `Spawned From`
- `Repo ID`
- `Repo Scope`
- `Document Inputs`
- `Acceptance Criteria`

### 失败场景

- 模板变量缺失
- batch 条目缺少必填字段
- `task_id` 找不到

### 调用位置

- `playbooks/create-vibekanban-issues.md`

---

## 3. `archive-session-result`

### 目标

把单次 session 的结构化结果归档到元仓库运行记录目录中。

### 典型调用

```bash
archive-session-result \
  --input .meta/session-result.yaml \
  --project-id sample-project \
  --issue-id issue-uuid \
  --workspace-id workspace-uuid \
  --output runs/sample-project/issue-uuid/workspace-uuid.yaml
```

### 输入

- `templates/session-result.yaml` 对应的实际结果文件
- 项目标识参数或从 manifest 获取的项目元信息

### 输出

- 元仓库 `runs/` 目录中的归档文件

### 最低输入字段

- `project_id`
- `task_id`
- `issue_id`
- `workspace_id`
- `repo_id`
- `result_status`
- `validation_status`
- `merge_readiness`
- `sync_status`
- `human_gate_required`
- `recommended_action`
- `relationship_snapshot`
- `followup_actions`

### 额外行为

- 自动创建目标目录
- 若输出路径已存在，可配置为拒绝覆盖或生成新版本

### 失败场景

- session result 缺少关键字段
- 输出路径不可写
- 结果状态与当前编排状态冲突

### 调用位置

- `playbooks/orchestrate-next-task.md`
- `playbooks/run-task.md`

---

## 4. `select-ready-task`

### 目标

基于 issue batch 与任务状态快照，筛选当前可进入执行队列的 ready task。

### 典型调用

```bash
select-ready-task \
  --batch .meta/vibekanban-issue-batch.yaml \
  --status .meta/task-status-snapshot.yaml \
  --output .meta/ready-task-selection.yaml
```

### 输入

- issue batch 文件
- 任务状态快照文件

### 输出

- ready task 清单
- auto start candidate
- excluded task 及原因

### 最低筛选规则

- `Execution Mode = executable`
- `Workspace Launchable = true`
- `depends_on` 全部完成
- `blocked_by` 不存在未解除阻塞
- 文档输入齐全
- 无人工闸门

### 调用位置

- `playbooks/orchestrate-next-task.md`

---

## 建议后续扩展脚本

当前 3 个脚本稳定后，再考虑：

- `create-vibekanban-issues`
- `link-vibekanban-relationships`
- `write-task-execution-summary`
- `sync-task-branch`

---

## 实现优先级

### Phase A：本地文件生成
- `generate-issue-batch`
- `render-issue-description`
- `archive-session-result`

### Phase B：接 VibeKanban MCP
- issue 创建
- relationship 建立
- 状态回写

### Phase C：自动编排
- ready task 选择
- 自动解锁
- 条件式自动启动下一个 session

---

## 推荐落地顺序

1. 先实现 `generate-issue-batch`
2. 再实现 `render-issue-description`
3. 再实现 `archive-session-result`
4. 等文件流稳定后，再连接 VibeKanban MCP

这个顺序最稳，因为它先解决“数据结构稳定”，再解决“外部系统集成”。
