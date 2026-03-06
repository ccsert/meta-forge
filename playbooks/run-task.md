# Playbook：运行单个任务

## 目标

定义如何从一个 ready task 启动单独 workspace session，并在结束后交给 orchestrator 决策下一步。

## 输入

- `project-manifest.yaml`
- 当前 `issue_id`
- `repo_id`
- `base_branch`
- 任务文档输入
- callback policy
- merge policy

## 启动前检查

- [ ] 当前任务是执行性任务
- [ ] 当前任务可在单 workspace 中闭环
- [ ] 文档输入齐全
- [ ] `depends_on` 全部满足
- [ ] 无未决人工闸门
- [ ] 已完成任务前同步（参考 `playbooks/pre-task-sync.md`）

## 启动动作

1. 执行任务前代码同步
2. 读取任务卡与依赖结果
3. 组装任务上下文
4. 调用 `start_workspace_session`
5. 在工作区执行编码、测试、文档更新
6. 产出结构化 session result
7. 在业务仓库写入任务执行摘要（参考 `templates/task-execution-summary.md`）

## session result 最低字段

- `issue_id`
- `workspace_id`
- `result_status`
- `validation_status`
- `human_gate_required`
- `recommended_action`
- `followup_actions`

## 结束后规则

- 不在当前 session 内直接决定全局调度
- 当前 session 结束后交给 orchestrator
- orchestrator 根据 `docs/session-orchestration.md` 决定是否解锁或启动下一任务
