# Playbook：通过 VibeKanban MCP 执行任务同步

## 目标

定义元仓库如何把本地半自动化产物交给 VibeKanban MCP 执行，同时保证 issue 创建过程幂等、可回溯、可重跑。

## 输入

- issue batch 文件
- issue 描述文件
- `issue-map.yaml`
- 项目 manifest
- VibeKanban MCP 可用环境

## 原则

- MCP 是唯一正式写入口
- 本地脚本只负责准备、校验、渲染与筛选
- 所有创建/更新/关系建立都必须回写映射

## 阶段 1：创建 issue 前准备

1. 运行 `generate-issue-batch`
2. 运行 `render-issue-description`
3. 加载 `issue-map.yaml`
4. 按 `task_id` 判断哪些任务未创建

## 阶段 2：幂等创建 issue

对每个任务：

1. 若 `task_id` 已映射 `issue_id`，跳过创建
2. 若未映射，则调用 MCP 创建 issue
3. 创建成功后立即回写 `issue-map.yaml`
4. 若失败，记录失败状态与错误摘要

## 阶段 3：幂等更新 issue

若 `task_id` 已存在，但内容变化：

- 不重新创建 issue
- 改为更新 issue 描述、标签或相关属性
- 更新 `description_hash` 与 `updated_at`

## 阶段 4：建立关系

只有当相关任务都已有 `issue_id` 映射后，才建立：

- `parent_of`
- `depends_on`
- `blocks`
- `relates_to`
- `spawned_from`

## 阶段 5：回写结果

每轮同步完成后，至少回写：

- `issue-map.yaml`
- 任务同步摘要
- 必要时更新 batch 文件中的 `task_to_issue`

## 关键约束

- 不允许跳过映射回写
- 不允许重跑时盲目重复创建
- 不允许未映射就直接建关系


## issue-map 存放约定

推荐采用双层约定：

- 业务仓库主副本：`docs/meta/issue-map.yaml`
- 元仓库索引/摘要：可放在 `projects/<project-id>/` 下，或后续统一索引目录

规则：

- 幂等判断以业务仓库主副本为准
- 元仓库可保留摘要或同步镜像，但不应与主副本分叉
- 每次 MCP 创建/更新/建关系后，都应优先更新业务仓库主副本
