# 自动化脚本接口协议

> 定义元仓库第一批自动化脚本的职责边界、输入输出、错误语义与调用位置。

## 目标

定义元仓库自动化脚本的职责边界、输入输出、错误语义与调用位置。

当前已实现 8 个脚本：

**数据生成层：**
- `generate-issue-batch` — 任务拆解 → issue 批量清单
- `render-issue-description` — issue 条目 → Markdown 描述
- `archive-session-result` — session 结果归档
- `select-ready-task` — 筛选 ready task

**编排层：**
- `check-stage-ready` — 阶段就绪验证
- `orchestrate-next-task` — 编排下一个任务
- `project-status` — 项目状态仪表盘

**入口层：**
- `meta-cli` — 统一 CLI 入口（`npm run meta -- <command>`）

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

- ~~`create-vibekanban-issues`~~
- `link-vibekanban-relationships`
- `write-task-execution-summary`
- `sync-task-branch`

---

## 5. `check-stage-ready`

### 目标

检查指定项目是否满足进入下一阶段的前置条件。

### 典型调用

```bash
check-stage-ready \
  --project xhs-draft-platform \
  --stage 3
```

省略 `--stage` 时自动检测当前所处阶段。

### 输入

- `projects/registry.yaml`（通过 project id 定位项目条目）
- 相关文档文件（根据阶段检查其存在性和内容）

### 输出

- JSON 对象：`project_id`, `current_stage`, `passed`, `errors`, `warnings`, `next_action`

### 检查规则

| 阶段 | 文档检查 | 内容检查 |
|------|---------|---------|
| 1 项目定义 | project-definition 存在 | 含目标、用户角色、核心功能 |
| 2 架构初始化 | architecture 存在 | 含系统边界、模块划分、技术选型 |
| 3 任务拆解 | task_breakdown 存在 | 含 Epic、Task 层级、依赖关系 |
| 4 仓库初始化 | — | repo_url / github_name 已配置 |
| 5 文档注入 | — | issue_map 路径已配置 |
| 6 VibeKanban 绑定 | — | organization_id / project_id / repo_id 已填 |
| 7 注册表 | — | 通过（能查到即存在） |
| 8 迭代执行 | — | 存在 ready task |

### 调用位置

- `meta-stage-gate` Skill
- `AI_ENTRYPOINT.md` 阶段路由
- `npm run meta -- stage`

---

## 6. `orchestrate-next-task`

### 目标

读取刚完成任务的 session-result，结合 issue-batch 和状态快照，按 callback-policy 决定下一步动作。

### 典型调用

```bash
orchestrate-next-task \
  --result .meta/session-result.yaml \
  --batch .meta/vibekanban-issue-batch.yaml \
  --status .meta/task-status-snapshot.yaml \
  --callback-policy unlock-next-on-done \
  --output .meta/orchestration-decision.yaml
```

### 输入

- session-result.yaml（已完成任务的结果）
- vibekanban-issue-batch.yaml（全量任务列表 + 依赖）
- task-status-snapshot.yaml（当前状态快照）

### 输出

- orchestration-decision.yaml：动作决策 + 新解锁任务 + auto_start_candidate + followup 清单

### 回调策略

| 策略 | 行为 |
|------|------|
| `manual-next` | 仅输出推荐，不自动操作 |
| `unlock-next-on-done` | 解锁下游任务（默认） |
| `start-next-on-done` | 若仅 1 个 ready task → 标记 auto_start |

### 调用位置

- `playbooks/orchestrate-next-task.md`
- Orchestrator Agent 流程
- `npm run meta -- next`

---

## 7. `project-status`

### 目标

输出项目仪表盘：阶段进度、任务统计、最近执行记录。

### 典型调用

```bash
project-status                          # 所有项目概览
project-status --project xhs-draft-platform  # 单项目详情
```

### 输入

- `projects/registry.yaml`
- `.meta/task-status-snapshot.yaml`（可选，提供任务统计）
- `runs/` 目录（可选，提供执行历史）

### 输出

- 终端格式化输出（进度条、统计表、执行记录）

### 调用位置

- Agent 会话开始时快速获取项目全貌
- `npm run meta -- status`

---

## 8. `meta-cli`

### 目标

统一 CLI 入口，转发子命令到对应脚本。

### 用法

```bash
npm run meta -- <command> [options]
```

### 可用命令

| 命令 | 转发到 |
|------|--------|
| `status` | `project-status.mjs` |
| `stage` | `check-stage-ready.mjs` |
| `next` | `orchestrate-next-task.mjs` |
| `ready` | `select-ready-task.mjs` |
| `generate` | `generate-issue-batch.mjs` |
| `render` | `render-issue-description.mjs` |
| `archive` | `archive-session-result.mjs` |
| `help` | 输出帮助信息 |

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
