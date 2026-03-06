# Workspace 合并流程

## 目标

定义任务完成后，如何将 workspace / worktree 中的代码安全合并回主分支，并在必要时创建补偿 issue。

## 输入

- 项目 manifest
- 当前 issue_id
- workspace_id
- repo_id
- base_branch
- merge policy

## 流程

1. 确认当前任务已满足 DoD
2. 拉取目标基线并尝试合并
3. 若无冲突，执行测试并提交
4. 若有冲突，按 `standards/merge-policy.md` 分类
5. 可自动解决则由 agent 处理并重新验证
6. 不可自动解决则创建新 issue，并关联原 issue
7. 更新元仓库中的执行记录
8. 执行 cleanup / downstream callback

## 输出

- merge result
- follow-up issue（如有）
- callback result
- execution log
