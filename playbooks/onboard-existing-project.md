# Playbook：接入已有项目（Onboard Existing Project）

> 将已有代码仓库纳入 meta-forge 统一管理，从代码倒推文档基线，使其与新项目享有相同的管理能力。

---

## 概览

```text
已有代码仓库
  → [阶段 O1] 项目审计           ← 人工闸门 ✅
  → [阶段 O2] 文档回填           ← 人工闸门 ✅
  → [阶段 O3] 任务梳理           ← 人工闸门 ✅
  → [阶段 O4] 注册表登记
  → [阶段 O5] VibeKanban 绑定    ← 可选
  → [阶段 O6] 进入迭代执行
```

### 与新项目流程的区别

| 维度 | 新项目（Stage 1-8） | 接入已有项目（O1-O6） |
|------|--------------------|-----------------------|
| 方向 | 想法 → 文档 → 代码 | 代码 → 文档 → 纳管 |
| 仓库 | 需要创建 | 已存在 |
| 架构 | 从需求推导 | 从代码分析反推 |
| 任务 | 全新拆解 | 梳理存量+增量 |
| 文档 | 正向生成 | 逆向回填 |

---

## 阶段 O1：项目审计

### 目标

深入分析已有仓库，生成 **审计报告**，为后续文档回填提供依据。

### 输入

- 已有代码仓库的本地路径或 GitHub URL
- 用户对项目的口头描述（可选）

### AI 操作

1. **扫描仓库结构**
   - 目录布局、入口文件、配置文件（package.json / go.mod / Cargo.toml / pyproject.toml 等）
   - README.md 及已有文档
   - CI/CD 配置（.github/workflows、Dockerfile 等）
   - 测试覆盖情况

2. **识别技术栈**
   - 语言、框架、依赖列表
   - 数据库 / 缓存 / 消息队列
   - 部署目标（Vercel / Docker / K8s 等）

3. **推断架构**
   - 模块划分（基于目录结构和导入关系）
   - 系统边界（前端 / 后端 / 数据层 / 外部服务）
   - 关键数据流
   - 已有接口契约（API routes、GraphQL schema 等）

4. **评估文档缺口**
   - 对照 `standards/document-baseline.md` 中的最低文档基线
   - 列出已有 vs 缺失的文档

5. **识别当前任务状态**
   - 已完成的功能 vs 进行中 / 未开始
   - 已知的 issue / TODO / FIXME
   - 已有的分支策略

### 输出

在业务仓库中创建 `docs/meta/onboard-audit.md`：

```markdown
# 项目审计报告

## 基本信息
- 仓库: <url>
- 语言: <languages>
- 技术栈: <stack>
- 部署方式: <deploy>

## 目录结构概要
<tree>

## 架构推断
### 系统边界
### 模块划分
### 关键数据流
### 接口清单

## 已有文档
- [ ] README.md
- [ ] API 文档
- [ ] 架构文档
- [ ] 部署文档
- [ ] ...

## 文档缺口分析
### 缺失项（对照 document-baseline.md）
### 需回填优先级

## 存量功能清单
### 已完成功能
### 进行中功能
### 已知 TODO / FIXME

## 建议
```

### 人工闸门

审计报告需人工确认后再进入文档回填阶段。确认要点：
- 架构推断是否准确
- 功能清单是否完整
- 文档缺口分析优先级是否合理

---

## 阶段 O2：文档回填

### 目标

根据审计报告，逆向生成 meta-forge 标准文档，使项目达到文档基线要求。

### AI 操作

按以下顺序生成文档（每个文档生成后等待人工确认）：

#### 1. 项目定义文档（project-definition.md）

基于审计报告 + 已有 README 生成：
- 提取项目目标、用户角色、核心功能
- 标注非目标范围
- 标注当前约束条件
- 生成里程碑（基于已完成功能推断进度）

参考模板：`templates/project-definition.md`

#### 2. 架构初始化文档（architecture-init.md）

基于审计报告中的架构推断生成：
- 系统边界图
- 模块划分与依赖关系
- 关键数据流
- 接口边界
- 技术选型及原因（逆向提取）

#### 3. ADR 文档

为已做出的关键决策补写 ADR：
- 技术栈选择
- 架构模式选择
- 关键取舍（如 SSR vs CSR、ORM vs Raw SQL）

### 输出

在业务仓库中创建：
- `docs/project-definition.md`
- `docs/architecture/architecture-init.md`
- `docs/adrs/` 目录下的 ADR 文件

### 人工闸门

文档回填需逐文档确认。确认要点：
- 项目定义是否准确反映项目现状
- 架构描述是否与实际代码对应
- ADR 是否完整覆盖关键决策

---

## 阶段 O3：任务梳理

### 目标

从已有代码中梳理任务结构，生成 meta-forge 标准的 `task-breakdown.md`。

### 与新项目的区别

新项目从零拆解全部任务；已有项目需要区分：
- **已完成任务**（status: done）— 功能已实现
- **进行中任务**（status: in-progress）— 部分实现或有 TODO
- **待开始任务**（status: ready / blocked）— 计划中或新增需求

### AI 操作

1. 基于审计报告中的"存量功能清单"，生成 Epic / Feature 级别的节点
2. 将已完成功能标记为 done
3. 将 TODO / FIXME / 已知 issue 转化为 Task 节点
4. 与用户确认后续迭代需求，补充新 Task
5. 建立 `depends_on` 关系
6. 所有 Task 填充 `repo_scope` 和验收标准

参考模板：`templates/task-breakdown.md`

### 输出

在业务仓库中创建：
- `docs/planning/task-breakdown.md`

### 人工闸门

任务树需人工确认：
- 已完成功能的覆盖是否完整
- 待开始任务的优先级和依赖是否正确
- 新增需求是否已纳入

---

## 阶段 O4：注册表登记

### 目标

将项目纳入 meta-forge 统一管理。

### AI 操作

1. 在 `projects/registry.yaml` 中新增项目条目
   - `playbook: onboard-existing`（区分于 `new-project`）
   - 填写仓库坐标、技术栈、部署目标
   - 配置 docs 索引路径
   - 配置 automation 策略

2. 在 `projects/graph.yaml` 中补充项目节点

3. 在业务仓库中创建：
   - `docs/meta/project-manifest.yaml`
   - `docs/meta/issue-map.yaml`

4. 运行 `node scripts/meta-cli.mjs stage --project <id>` 验证阶段就绪

### 产物校验

```bash
node scripts/meta-cli.mjs stage --project <id>
# 预期：阶段 1-5 全部 passed
```

---

## 阶段 O5：VibeKanban 绑定（可选）

### 前提

若项目需要通过 VibeKanban 管理任务，执行此阶段。

### AI 操作

1. 使用 `meta-vibekanban-sync` Skill 绑定项目
2. 将 task-breakdown 中的节点同步为 VibeKanban issue
3. 已完成任务同步后直接标记为 done
4. 回填 `issue-map.yaml` 中的 MCP ID

### 参考

- `.agents/skills/meta-vibekanban-sync/SKILL.md`
- `playbooks/use-vibekanban-mcp.md`

---

## 阶段 O6：进入迭代执行

### 进入条件

```yaml
checklist:
  - onboard-audit.md 已确认: true
  - project-definition.md 已回填: true
  - architecture-init.md 已回填: true
  - task-breakdown.md 已梳理: true
  - registry.yaml 已登记: true
  - project-manifest.yaml 已创建: true
  - issue-map.yaml 已创建: true
```

### 进入后

项目等同于新项目完成 Stage 1-7 后的状态，可以：
- 使用 `meta-stage-gate` 检查阶段
- 使用 `meta-cli next` 编排任务
- 使用 Execution Agent 执行任务
- 使用 Review / Merge Agent 审查合并

---

## 与现有工具的集成

| 工具 / 脚本 | 在接入流程中的用途 |
|-------------|-------------------|
| `meta-cli stage` | O4 结束后验证阶段完整性 |
| `meta-cli status` | O6 后查看项目仪表盘 |
| `meta-vibekanban-sync` | O5 同步任务 |
| `check-stage-ready.mjs` | 验证文档基线是否满足 |
| `standards/document-baseline.md` | O1 评估文档缺口的对照标准 |

---

## 常见场景

### 场景 A：有 README、无其他文档的个人项目
- O1 主要依赖代码分析
- O2 全部回填
- O3 重点在增量任务

### 场景 B：有部分文档的团队项目
- O1 审计已有文档与缺口
- O2 可跳过已有且达标的文档，只补缺失项
- O3 整合已有 issue 系统

### 场景 C：已有其他项目管理工具（Jira / Linear）
- O3 任务梳理时参考已有工具中的数据
- O5 选择是否双向同步或单向迁移
