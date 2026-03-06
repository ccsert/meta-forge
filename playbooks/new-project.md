# Playbook：新项目创建与落库

> 从一个想法，到一个被元仓库、GitHub、VibeKanban 统一托管的业务项目。

---

## 概览

```text
想法输入
  → [阶段1] 项目定义           ← 人工闸门 ✅
  → [阶段2] 架构初始化         ← 人工闸门 ✅
  → [阶段3] 任务拆解           ← 人工闸门 ✅
  → [阶段4] GitHub 仓库创建
  → [阶段5] 本地初始化与文档注入
  → [阶段6] VibeKanban 绑定
  → [阶段7] 元仓库登记与依赖建模
  → [阶段8] 进入迭代执行
```

---

## 前置条件

在开始前，需满足：

- 已完成 `project-definition.md`
- 已完成 `architecture-init.md`
- 已完成 `task-breakdown.md`
- 已确定仓库所有者、仓库名、项目类型、默认分支
- 本机可使用 `gh` 命令
- 已具备目标 GitHub 组织/个人仓库创建权限
- 已具备 VibeKanban MCP 可用环境

---

## 阶段 1：项目定义

### 目标
产出结构化 `project-definition.md`

### 加载上下文
- `prompts/analysis/requirements-analysis.md`
- `templates/project-definition.md`

### 输出检查清单
- [ ] 项目名称与目标清晰
- [ ] 用户角色已识别
- [ ] 核心功能已列出
- [ ] 非目标范围已明确
- [ ] 技术栈已初步选定
- [ ] 约束条件已记录
- [ ] 里程碑已初步规划

### 🚦 人工闸门
确认通过后进入阶段 2。

---

## 阶段 2：架构初始化

### 目标
产出结构化 `architecture-init.md` 与初始 ADR。

### 加载上下文
- `prompts/architecture/system-architecture.md`
- `templates/tech-design.md`
- `templates/adr.md`

### 输出检查清单
- [ ] 系统上下文图已描述
- [ ] 模块划分已确定
- [ ] 关键接口已定义
- [ ] 数据模型已初步设计
- [ ] 技术选型已说明理由
- [ ] 至少一条 ADR 已记录

### 🚦 人工闸门
确认通过后进入阶段 3。

---

## 阶段 3：任务拆解

### 目标
产出结构化任务树，并准备同步到 VibeKanban。

### 加载上下文
- `prompts/planning/task-breakdown.md`
- `standards/task-relationship-model.md`
- `standards/task-execution-unit.md`
- `standards/document-baseline.md`
- `standards/dod.md`
- `templates/task-breakdown.md`

### 输出检查清单
- [ ] Epic / Feature / Story / Task 层级清晰
- [ ] 每个 Task 有明确验收标准
- [ ] `depends_on` 与 `parent_of` 已区分
- [ ] 每个执行性 Task 可在单 workspace 中独立闭环
- [ ] 每个执行性 Task 都有明确文档输入
- [ ] 风险任务已识别
- [ ] repo_scope 与文档输入已标注

### 🚦 人工闸门
确认通过后进入阶段 4。

---

## 阶段 4：GitHub 仓库创建

### 目标
创建远程仓库，并获得标准化仓库坐标。

### 输入
- `project_id`
- `project_name`
- `github_owner`
- `github_repo_name`
- `visibility`：`public` / `private`
- `default_branch`

### 标准动作

1. 创建远程仓库
2. 获取 `repo_url`
3. 约定本地目录
4. 初始化默认分支

### 参考命令

```bash
gh repo create <owner>/<repo> --private --clone
cd <repo>
git checkout -b main
```

如已在本地生成目录，也可使用：

```bash
gh repo create <owner>/<repo> --private --source=. --remote=origin --push
```

### 输出
- `repo_url`
- `local_path`
- `default_branch`

---

## 阶段 5：本地初始化与文档注入

### 目标
把业务仓库从“空仓库”初始化成“可进入开发的项目骨架”。

### 必注入内容

#### 根目录基础文件
- `README.md`
- `.gitignore`
- `.editorconfig`
- 环境变量示例文件（如 `.env.example`）
- 基础 CI 配置（按项目类型决定）

#### 文档目录
- `docs/project-definition.md`
- `docs/architecture/architecture-init.md`
- `docs/adrs/`
- `docs/planning/task-breakdown.md`
- `docs/meta/project-manifest.yaml`
- `docs/meta/issue-map.yaml`

#### 建议补齐的参考文档
- `docs/domain-model.md`
- `docs/api-contracts.md`
- `docs/data-model.md`
- `docs/testing-strategy.md`

#### 初始化说明
- 项目启动命令
- 测试命令
- lint / typecheck 命令
- 部署目标说明

### 强制要求
- 注入文档必须来自元仓库产物，而不是人工随意复制
- `project-manifest.yaml` 必须写入业务仓库，作为仓库内机器上下文入口
- `issue-map.yaml` 必须在业务仓库建立主副本，用于 MCP 幂等创建与关系同步
- 首次提交必须包含设计文档，不允许只推空骨架
- 在文档基线不足前，不应批量创建执行性任务

### 输出检查清单
- [ ] 仓库目录结构已创建
- [ ] 文档已注入
- [ ] manifest 已写入
- [ ] issue-map 主副本已写入
- [ ] 首次提交已完成
- [ ] 远程仓库已推送

---

## 阶段 6：VibeKanban 绑定

### 目标
让业务仓库、任务系统、workspace session 建立统一映射。

### 标准动作

1. 在 VibeKanban 中确认目标 organization / project
2. 将业务仓库登记为 repo
3. 记录返回的 `repo_id`
4. 设置 repo scripts：
   - `setup_script`
   - `cleanup_script`
   - `dev_server_script`
5. 创建或绑定远程项目 issue 容器

### 需要记录的 ID
- `organization_id`
- `project_id`
- `board_id`
- `repo_id`

### 规则
- 所有外部 ID 必须同时写入业务仓库 `project-manifest.yaml` 与元仓库 `projects/registry.yaml`
- repo scripts 的真实内容优先由业务仓库能力决定，但其管理权归元仓库协议

---

## 阶段 7：元仓库登记与依赖建模

### 目标
将项目正式纳入元仓库统一管理。

### 必做动作

1. 在 `projects/registry.yaml` 中新增项目条目
2. 在 `projects/graph.yaml` 中补充项目节点
3. 若存在外部依赖仓库、共享基础设施或上游项目，补依赖边
4. 记录关键文档路径与自动化策略

### 必填信息
- 项目基础信息
- 仓库信息
- VibeKanban 信息
- 文档索引
- automation 策略

### 输出检查清单
- [ ] registry 条目已写入
- [ ] graph 节点已写入
- [ ] 外部 ID 已持久化
- [ ] 自动化策略已显式声明

---

## 阶段 8：进入迭代执行

### 目标
使项目进入“任务驱动开发”状态。

### 标准动作

1. 将 `task-breakdown.md` 映射为 VibeKanban issue
2. 建立 `parent_of` / `depends_on` / `relates_to` / `spawned_from`
3. 选择 ready task
4. 调用 `start_workspace_session`
5. 在业务仓库执行开发
6. 完成后进入 `playbooks/merge-workspace.md`

---

## 注册表回写规则

当新项目创建完成后，必须至少回写以下位置：

- 元仓库：`projects/registry.yaml`
- 元仓库：`projects/graph.yaml`
- 业务仓库：`docs/meta/project-manifest.yaml`

---

## 最小可执行 SOP

如果当前只想打通第一版闭环，按下面顺序做：

1. 完成 `project-definition.md`
2. 完成 `architecture-init.md`
3. 完成 `task-breakdown.md`
4. 执行 `gh repo create`
5. 初始化本地项目骨架
6. 注入 3 份核心文档 + manifest
7. 首次提交并推送
8. 登记 VibeKanban repo_id
9. 回写元仓库 registry / graph
10. 创建第一批任务并启动首个 workspace session
