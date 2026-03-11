# 运作模型说明

---

## 整体架构

```
┌─────────────────────────────────────────────┐
│                  meta-repo                  │
│  prompts / skills / standards / playbooks   │
│  templates / generators / projects          │
└──────────────────┬──────────────────────────┘
                   │ 知识驱动
                   ▼
┌─────────────────────────────────────────────┐
│                   Codex                     │
│         对话 · 思考 · 产出结构化结果          │
└──────────┬──────────────────┬───────────────┘
           │ 任务编排          │ 代码产出
           ▼                  ▼
┌──────────────────┐  ┌───────────────────────┐
│   VibeKanban     │  │     业务仓库            │
│  任务 · 依赖 · 状态│  │  真实业务代码           │
└──────────────────┘  └───────────────────────┘
```

---

## 三个核心角色

### 元仓库（meta-repo）
- 沉淀方法论、提示词、技能、规范、模板
- 管理所有业务项目注册信息
- 是整个体系的"操作系统"
- **不包含业务代码**

### Codex
- 基于元仓库知识进行思考
- 产出结构化结果（项目定义、架构、任务树、代码）
- 通过 VibeKanban MCP 操作任务
- 在业务仓库中执行代码变更

### VibeKanban
- 作为任务状态机
- 管理任务依赖关系
- 提供人机协作界面
- 通过 MCP 暴露操作能力

---

## 项目生命周期

### 阶段 1：项目定义
```
输入：项目想法 / 需求描述
工具：prompts/analysis + templates/project-definition
产出：project-definition.md（结构化）
闸门：人工确认 ✅
```

### 阶段 2：架构初始化
```
输入：project-definition.md
工具：prompts/architecture + agents/architecture-agent.md
产出：architecture-init.md（上下文图、模块划分、ADR）
闸门：人工确认 ✅
```

### 阶段 3：任务拆解
```
输入：architecture-init.md
工具：prompts/planning + standards/task-execution-unit.md
产出：task-breakdown.md（Epic → Feature → Story → Task + 依赖）
闸门：人工确认 ✅
```

### 阶段 4：仓库初始化
```
输入：project-definition + architecture-init
工具：generators/ + .agents/skills/meta-project-bootstrap
产出：业务仓库骨架（目录结构、CI、README、ADR、环境配置）
```

### 阶段 5：迭代执行
```
循环：
  1. 从 VibeKanban 读取 ready task
  2. 组装任务上下文（任务卡 + 依赖结果 + skills + standards）
  3. Codex 在业务仓库实现
  4. 运行测试 / 静态检查
  5. 更新文档
  6. 回写任务状态
  7. 必要时请求人工 review
```

---

## 输出协议

所有 Codex 产出必须是**结构化格式**，不接受纯自然语言。

| 产出类型 | 格式 | 模板位置 |
|----------|------|----------|
| 项目定义 | Markdown 固定结构 | templates/project-definition.md |
| 架构文档 | Markdown 固定结构 | templates/tech-design.md |
| 任务拆解 | YAML / Markdown 表格 | templates/task-breakdown.md |
| ADR | Markdown 固定结构 | templates/adr.md |
| PRD | Markdown 固定结构 | templates/prd.md |

---

## 经验回流机制

每个项目结束后，以下内容应回流到元仓库：

- 有效的新 prompt → `prompts/`
- 有效的新 skill → `skills/`
- 架构决策 → `standards/` 或 `docs/`
- 流程改进 → `playbooks/`
- 新项目类型模板 → `generators/`
