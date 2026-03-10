# Playbook：经验回流

> 将项目执行中积累的有效经验沉淀回元仓库，避免知识随对话消散。

---

## 目标

每个项目迭代或关键里程碑完成后，将有价值的产物回流到元仓库，使后续项目受益。

---

## 触发时机

- 单个任务完成且 review 通过后
- 一个 Sprint / 迭代结束时
- 项目关键里程碑达成时
- 遇到重大问题并解决后

---

## 回流分类

| 回流类型 | 目标位置 | 说明 |
|----------|----------|------|
| 新 Prompt | `prompts/` | 验证有效的提示词模式 |
| 新 Skill | `.agents/skills/` | 可复用的流程自动化 |
| 架构决策 | `standards/` 或 `docs/` | 跨项目适用的技术决策 |
| 流程改进 | `playbooks/` | 流程优化或新增步骤 |
| 新项目模板 | `generators/` | 新的项目类型脚手架 |
| 编码规范更新 | `standards/coding.md` | 新的规范条目 |
| 工具链改进 | `scripts/` | 脚本改进或新增脚本 |

---

## 回流流程

### 步骤 1：识别回流候选

在任务执行或 review 过程中，若发现以下情况，标记为回流候选：

- 某个 prompt 模式反复有效
- 某个操作步骤在多个任务中重复
- 发现了当前标准/规范的不足
- 解决了一个新类型的技术问题
- 发现新的最佳实践

### 步骤 2：记录回流条目

在 session-result.yaml 的 `followup_actions` 中记录：

```yaml
followup_actions:
  - type: experience_feedback
    category: prompt | skill | standard | playbook | generator | script
    summary: "简要描述这个经验"
    detail: "详细说明"
    target_file: "预期回流到的文件路径"
```

### 步骤 3：Orchestrator 审查

Orchestrator Agent 在归档运行结果时：

1. 检查 `followup_actions` 中是否有 `experience_feedback` 条目
2. 评估每个条目是否值得回流
3. 值得回流的条目标记为待处理

### 步骤 4：执行回流

对每个待处理的回流条目：

1. 确定目标文件位置
2. 若是新增文件，创建并遵循对应目录的模板规范
3. 若是修改已有文件，在合适位置追加内容
4. 提交到元仓库

### 步骤 5：验证

- 回流的内容不应与已有规范冲突
- 新增的 prompt / skill 应标注来源项目
- 更新 `docs/roadmap.md` 反映回流完成情况

---

## 约束

- 回流内容不应包含业务代码
- 回流内容不应包含项目敏感信息（密钥、账号等）
- 回流应经过人工确认，不自动提交
- 每次回流应是最小化变更
