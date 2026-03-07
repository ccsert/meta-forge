# 元仓库 Skills 拆分方案

## 1. 目标

将当前元仓库中“容易跑偏、重复率高、需要稳定触发”的流程从散落的 `playbooks + standards + templates`，升级为可触发、可复用、可逐步脚本化的 skills 体系。

本方案不替代现有元仓库文档，而是：

- 用 `skills` 负责触发与流程引导
- 用 `scripts` 负责确定性动作
- 用 `references` 负责按需加载的说明材料
- 用现有 `standards` 和 `playbooks` 继续作为规则与总流程来源

---

## 2. 为什么要做 Skills 化

本次实际协作暴露出以下问题：

- agent 容易从“元仓库阶段判断”滑向“直接业务实现”
- 阶段边界虽然在文档中存在，但对对话内行为约束不够强
- 任务描述虽然有模板，但 issue 创建时没有被强制套用
- VibeKanban 的绑定、回填、同步步骤重复度高，适合流程固化
- 当前大量依赖人工记忆和即时判断，缺少稳定触发器

因此，需要把最关键、最容易出错的流程转成可触发 skill。

---

## 3. 总体设计原则

### 3.1 Skill 只做流程，不做一切

skill 应聚焦：

- 什么时候触发
- 触发后读哪些最小上下文
- 先做什么、后做什么
- 哪一步调用哪个脚本
- 哪些动作被允许，哪些动作被禁止

不应把所有详细说明都塞进 `SKILL.md`。

### 3.2 Script 负责确定性动作

凡是以下类型动作，优先沉淀为脚本：

- 可校验的状态检查
- 固定格式渲染
- 文件回写
- 同步动作
- 批量关系创建

### 3.3 Reference 负责按需加载

详细说明应进入：

- `references/`
- 或复用现有元仓库的 `playbooks/`、`standards/`、`docs/`

### 3.4 先解决最大问题，不追求一次做全

首批 skills 优先解决：

- 阶段判断漂移
- 任务描述不合规
- VibeKanban 同步过程靠人工拼装

---

## 4. 推荐 Skills 拆分

### 4.1 `meta-stage-gate`

#### 作用

用于识别当前项目处于哪个阶段，输出阶段快照，并明确：

- 当前允许动作
- 当前禁止动作
- 下一步应该进入哪个 playbook

#### 典型触发场景

- 用户问“我们现在到哪一步了”
- 用户问“是否可以继续下一步”
- 用户问“现在是否可以开始执行任务”
- 任何涉及阶段切换的请求

#### 主要职责

- 判断当前项目属于 `阶段 1~8` 中的哪一步
- 判断当前是否仍处于 `meta-repo` 流程
- 给出 `completed / partial / pending` 状态快照
- 明确当前的 `allowed actions / forbidden actions`
- 阻止 agent 在未达条件时进入业务执行

#### 依赖内容

- `AI_ENTRYPOINT.md`
- `docs/ai-stage-routing.md`
- `playbooks/new-project.md`
- `standards/document-baseline.md`

#### 推荐脚本

- `scripts/check-stage-ready.mjs`
- `scripts/snapshot-stage-status.mjs`

---

### 4.2 `meta-new-project`

#### 作用

用于从需求对话推进到：

- `project-definition.md`
- `architecture-init.md`
- `task-breakdown.md`

#### 典型触发场景

- 用户提出一个新项目想法
- 用户要求从需求开始立项
- 用户要把一个业务构想变成元仓库项目基线

#### 主要职责

- 引导生成项目定义
- 引导生成架构初始化文档
- 引导生成任务拆解文档
- 提醒人工闸门
- 不允许跳过阶段直接进入业务代码实现

#### 依赖内容

- `playbooks/new-project.md`
- `agents/requirements-agent.md`
- `agents/architecture-agent.md`
- `agents/planning-agent.md`
- `standards/document-baseline.md`

#### 推荐脚本

- `scripts/validate-doc-baseline.mjs`
- `scripts/init-project-docs.mjs`

---

### 4.3 `meta-project-bootstrap`

#### 作用

用于完成：

- GitHub 仓库创建
- 本地业务仓初始化
- 文档注入
- manifest / issue-map 主副本建立

#### 典型触发场景

- 用户确认立项文档已完成
- 用户要求创建业务仓
- 用户要求把元仓库文档注入业务仓

#### 主要职责

- 收集仓库坐标
- 创建远程仓库
- 初始化本地业务仓
- 注入文档
- 建立业务仓 `docs/meta/project-manifest.yaml`
- 建立业务仓 `docs/meta/issue-map.yaml`

#### 依赖内容

- `playbooks/new-project.md`
- `docs/meta/new-project-gate-checklist.md`
- `docs/meta/project-manifest.draft.yaml`
- `docs/meta/issue-map.draft.yaml`

#### 推荐脚本

- `scripts/bootstrap-business-repo.mjs`
- `scripts/inject-meta-docs.mjs`

---

### 4.4 `meta-vibekanban-sync`

#### 作用

用于完成：

- VibeKanban 绑定
- ID 查询与回填
- issue 创建与更新
- 关系同步
- `issue-map` 回写

#### 典型触发场景

- 用户提到 `VibeKanban`
- 用户提到 `MCP`
- 用户要求创建 issue / 回填 ID / 同步任务
- 用户要把 `task-breakdown` 映射到 VibeKanban

#### 主要职责

- 查询 `organization_id` / `project_id` / `repo_id`
- 判断哪些 ID 当前可以安全回填
- 创建 Epic / Feature / Story / Task
- 更新 issue 描述
- 同步 `depends_on` / `parent_of` 等关系
- 回写 `issue-map`

#### 依赖内容

- `playbooks/use-vibekanban-mcp.md`
- `docs/vibekanban-mcp-idempotency.md`
- `docs/meta/issue-map.draft.yaml`
- `standards/task-relationship-model.md`

#### 推荐脚本

- `scripts/backfill-vibekanban-ids.mjs`
- `scripts/sync-task-breakdown-to-vibekanban.mjs`
- `scripts/sync-issue-relationships.mjs`

---

### 4.5 `meta-task-description`

#### 作用

用于保证 VibeKanban 中的任务描述符合元仓库协议，特别是执行性任务。

#### 典型触发场景

- 创建执行性 issue
- 更新 ready task 描述
- 用户问“当前任务描述是否符合规范”
- 需要将 `task-breakdown` 渲染成 issue description

#### 主要职责

- 按模板渲染 issue description
- 区分 `epic/feature/story/task` 的描述层次
- 校验执行性任务是否具备最小字段
- 在任务描述不合规时阻止其进入 ready 集合

#### 依赖内容

- `templates/vibekanban-issue-description.md`
- `standards/task-description-protocol.md`
- `standards/executable-task-policy.md`
- `standards/task-execution-unit.md`

#### 推荐脚本

- `scripts/render-vibekanban-description.mjs`
- `scripts/validate-issue-description.mjs`

---

## 5. 推荐的脚本职责边界

### 5.1 `check-stage-ready`

输入：

- 当前项目根目录
- 目标阶段

输出：

- 是否满足进入该阶段的条件
- 缺失文件与阻塞项清单

### 5.2 `snapshot-stage-status`

输入：

- 当前项目根目录

输出：

- 当前阶段
- 已完成项
- 部分完成项
- 未完成项
- 下一步建议

### 5.3 `render-vibekanban-description`

输入：

- task metadata
- project metadata
- repo metadata
- 关系索引

输出：

- 符合模板的 Markdown 描述

### 5.4 `validate-issue-description`

输入：

- issue description markdown
- issue type

输出：

- 缺失字段清单
- 是否允许进入 ready

### 5.5 `sync-task-breakdown-to-vibekanban`

输入：

- `task-breakdown.md`
- `issue-map.yaml`
- `project_id`

输出：

- 创建/更新 issue
- 回写 issue_id

### 5.6 `sync-issue-relationships`

输入：

- 关系定义
- issue-map

输出：

- 批量建立 `parent_of` / `depends_on` / `blocking` / `related`

---

## 6. 硬规则建议

以下规则建议在对应 skill 中明确写为“必须”，不要只写成建议。

### 6.1 阶段规则

- 在 `meta-repo` 中，若当前仍处于 `new-project` 流程，则禁止默认进入业务代码实现
- 未通过人工闸门时，禁止推进到下一阶段
- 未创建业务仓时，禁止进入执行性 task 的 workspace 启动建议

### 6.2 任务描述规则

- 所有 `workspace_launchable: true` 的任务，必须符合 `templates/vibekanban-issue-description.md`
- 若缺少模板必填字段，则该任务不得进入 ready 集合
- issue 描述中的关系索引必须与 `issue-map` 保持一致

### 6.3 VibeKanban 规则

- `organization_id / project_id / repo_id` 必须通过 MCP 查询或可信来源回填
- 未完成 repo 绑定时，禁止回填 repo_id
- issue 同步必须幂等，不允许重复建单

---

## 7. 实施优先级

### 第一优先级

#### `meta-stage-gate`

优先原因：

- 直接解决“总是跳阶段”的问题
- 对所有其它 skill 都是前置守门能力

#### `meta-task-description`

优先原因：

- 直接解决“任务描述不合规”的问题
- 对后续 VibeKanban 同步质量影响最大

### 第二优先级

#### `meta-vibekanban-sync`

优先原因：

- 当前 VibeKanban 动作已经很多，最值得脚本化
- 可显著降低手工回填和描述漂移

### 第三优先级

#### `meta-project-bootstrap`

优先原因：

- 当前已经可以手工完成，但仍值得规范化
- 适合在阶段 4/5 高复用时落地

### 第四优先级

#### `meta-new-project`

优先原因：

- 流程已存在，短期内不如阶段守门与描述规范化来得迫切
- 更适合在前面 3 个 skill 稳定后再统一整合

---

## 8. 推荐目录结构

```text
skills/
  meta-stage-gate/
    SKILL.md
    scripts/
      check-stage-ready.mjs
      snapshot-stage-status.mjs
    references/
      stage-routing.md

  meta-task-description/
    SKILL.md
    scripts/
      render-vibekanban-description.mjs
      validate-issue-description.mjs
    references/
      issue-description-fields.md

  meta-vibekanban-sync/
    SKILL.md
    scripts/
      backfill-vibekanban-ids.mjs
      sync-task-breakdown-to-vibekanban.mjs
      sync-issue-relationships.mjs
    references/
      vibekanban-id-resolution.md

  meta-project-bootstrap/
    SKILL.md
    scripts/
      bootstrap-business-repo.mjs
      inject-meta-docs.mjs
    references/
      repo-bootstrap-checklist.md

  meta-new-project/
    SKILL.md
    scripts/
      validate-doc-baseline.mjs
    references/
      new-project-flow.md
```

---

## 9. 当前建议结论

当前元仓库非常适合进行 skills 化，但不建议：

- 把所有 playbook 全部塞进单个 skill
- 只写 skill，不补脚本
- 不做硬规则就直接期待触发效果变好

最推荐的路线是：

1. 先做 `meta-stage-gate`
2. 再做 `meta-task-description`
3. 再做 `meta-vibekanban-sync`
4. 最后补 `meta-project-bootstrap` 与 `meta-new-project`

这样可以先解决当前最明显的问题：

- 阶段判断漂移
- issue 描述不合规
- VibeKanban 同步靠人工拼装
