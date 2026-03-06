# Playbook：任务启动前代码同步

## 目标

确保每次任务开始前，workspace / worktree 都基于最新代码状态，避免在过期代码上继续开发。

## 核心原则

- 每次启动任务前都必须同步最新基线
- 不能默认当前 workspace 中的代码就是最新的
- 若当前工作区落后于默认分支或目标基线，必须先同步再开发

## 适用场景

- 启动新的 workspace session 前
- 恢复一个已有 workspace 前
- 合并前验证前
- 长时间未活动的工作区重新继续开发前

## 同步对象

至少检查并同步：

- 远程默认分支（如 `main`）
- 当前任务的 `base_branch`
- 当前 workspace 对应分支

## 标准流程

### 1. 获取最新远程状态

```bash
git fetch --all --prune
```

### 2. 确认基线分支最新提交

```bash
git checkout <base_branch>
git pull --ff-only
```

### 3. 切回任务分支并同步基线

可选策略：

#### rebase 优先
```bash
git checkout <task_branch>
git rebase <base_branch>
```

#### merge 基线
```bash
git checkout <task_branch>
git merge <base_branch>
```

## 决策规则

- 默认优先使用 `rebase` 保持线性历史
- 若仓库策略不允许 rebase，则采用 merge
- 若同步时出现高风险冲突，则停止并进入人工或 follow-up 处理

## 启动前检查清单

- [ ] 已执行 `git fetch --all --prune`
- [ ] `base_branch` 已更新到远程最新
- [ ] 当前任务分支已同步基线
- [ ] 当前工作区无未确认高风险冲突
- [ ] 准备开始执行的代码不是过期状态

## 与任务执行的关系

只有通过上述检查，任务才允许进入实际编码阶段。
