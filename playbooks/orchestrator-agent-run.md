# Playbook：Orchestrator Agent 执行流

## 目标

定义 `Orchestrator Agent` 如何在元仓库中驱动“需求产物 → 任务同步 → 任务执行 → 结果归档 → 下一任务编排”的完整闭环。

## 适用范围

适用于以下场景：

- 新项目初始化后的首次任务同步
- 已存在项目的增量任务同步
- 某个任务完成后的下一任务编排
- 例行检查 issue-map、ready task、runs 状态

## 核心职责

`Orchestrator Agent` 只做调度，不直接写业务代码。

它负责：

- 检查项目是否具备进入下一阶段的前置条件
- 触发本地脚本生成结构化产物
- 通过 MCP 执行正式写入动作
- 维护 `issue-map.yaml`
- 维护 `runs/` 归档
- 选择并触发下一步 agent

---

## 输入

- 元仓库 playbooks / standards / templates
- 业务仓库 `docs/meta/project-manifest.yaml`
- 业务仓库 `docs/meta/issue-map.yaml`
- 业务仓库 `docs/planning/task-breakdown.md`
- 元仓库 `projects/registry.yaml`
- 元仓库 `runs/`

---

## 输出

- issue batch
- issue 描述正文
- issue-map 更新
- ready task selection
- 任务调度决定
- execution result 归档

---

## 阶段 1：项目状态检查

开始前先判断项目处于哪个阶段：

### 若缺少项目定义
- 转交 `Requirements Agent`

### 若缺少架构初始化
- 转交 `Architecture Agent`

### 若缺少任务拆解
- 转交 `Planning Agent`

### 若项目文档基线已具备
- 进入任务同步阶段

---

## 阶段 2：生成同步输入

执行顺序：

1. 运行 `generate-issue-batch`
2. 为 batch 中每个任务运行 `render-issue-description`
3. 加载业务仓库 `issue-map.yaml`
4. 准备 MCP 同步输入

### 本阶段目标

把 AI 生成的 `task-breakdown.md` 转成：

- 机器可读的 batch
- 标准化 issue 描述
- 幂等同步所需映射输入

---

## 阶段 3：通过 MCP 幂等同步 issue

执行顺序：

1. 按 `task_id` 检查 `issue-map.yaml`
2. 未映射任务：调用 MCP 创建 issue
3. 已映射但内容变化：调用 MCP 更新 issue
4. 每次成功后立即回写 `issue-map.yaml`
5. 全部节点同步后，再建立关系

### 关键约束

- MCP 是唯一正式写入口
- 不允许跳过映射回写
- 不允许未映射就建立关系

参考：`playbooks/use-vibekanban-mcp.md`

---

## 阶段 4：选择 ready task

执行顺序：

1. 准备最新任务状态快照
2. 运行 `select-ready-task`
3. 输出 ready task 清单
4. 判断 callback policy 与风险策略

### 默认规则

- 默认只解锁，不自动连续启动多个任务
- 只有唯一 ready 且低风险时，才允许自动启动

---

## 阶段 5：启动 Execution Agent

若存在可执行 ready task：

1. 确认当前任务满足执行条件
2. 确认已完成 pre-task sync
3. 转交 `Execution Agent`
4. 等待其返回 `session-result.yaml`

若不存在 ready task：

- 停止自动推进
- 等待人工或上游任务变化

---

## 阶段 6：归档结果并编排下一步

当 `Execution Agent` 返回结果后：

1. 运行 `archive-session-result`
2. 检查 `session-result.yaml`
3. 按 `orchestrate-next-task` 规则决定：
   - 停止
   - 解锁下游
   - 自动启动下一个任务
   - 创建 follow-up issue
   - 请求人工介入

---

## 阶段 7：触发 Review / Merge Agent

在以下场景转交 `Review / Merge Agent`：

- 当前任务已完成，需要合并判断
- 存在 merge 冲突
- 需要复核 DoD
- 需要冲突分类与后续 issue 建议

`Orchestrator Agent` 不自行拍板高风险 merge。

---

## 推荐日常循环

### 循环入口

1. 检查项目文档与任务状态
2. 同步 issue 与关系
3. 选择 ready task
4. 启动执行
5. 归档结果
6. 编排下一步

### 循环退出条件

- 无 ready task
- 存在人工闸门
- 存在高风险冲突
- 项目进入等待外部依赖状态

---

## 最小日常命令流

```bash
npm run generate-issue-batch -- ...
npm run render-issue-description -- ...
npm run select-ready-task -- ...
npm run archive-session-result -- ...
```

然后由 agent 按 playbook 通过 MCP 执行：

- 创建 / 更新 issue
- 建立关系
- 启动 workspace session
- 回写状态与映射

---

## 一个关键原则

`Orchestrator Agent` 不是“万能 agent”，而是“流程控制器”。

它的成功标准不是自己做完所有事，而是：

- 让正确的 agent 在正确的阶段接手
- 让每一步都有结构化输入输出
- 让流程可重跑、可回溯、可中断恢复
