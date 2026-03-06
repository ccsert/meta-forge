# 项目注册表 Schema 约定

## 目标

统一 `projects/registry.yaml` 中每个项目条目的字段，确保项目、仓库、VibeKanban、自动化策略可追踪。

## 必填字段

- `id`
- `name`
- `status`
- `repo`
- `type`
- `created_at`
- `playbook`

## 建议字段

### 基础信息
- `description`
- `tech_stack`
- `deploy_target`
- `branch_strategy`

### VibeKanban 映射
- `vibekanban.organization_id`
- `vibekanban.project_id`
- `vibekanban.board_id`
- `vibekanban.repo_id`

### 仓库信息
- `repository.default_branch`
- `repository.local_path`
- `repository.setup_script_managed`
- `repository.cleanup_script_managed`

### 文档索引
- `docs.project_definition`
- `docs.architecture`
- `docs.task_breakdown`
- `docs.adr_dir`
- `docs.issue_map`

### 自动化策略
- `automation.callback_policy`
- `automation.merge_policy`
- `automation.default_executor`
- `automation.auto_start_next_task`

## 规则

- `id` 必须稳定，不随展示名变化
- 所有外部系统 ID 必须单独存储，不能只写在备注里
- 文档路径优先记录仓库内相对路径
- `issue-map.yaml` 建议记录业务仓库主副本路径，并允许元仓库存索引摘要
- 策略字段必须显式，避免依赖隐式默认值
