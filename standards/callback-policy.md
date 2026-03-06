# 回调策略

## 目标

定义任务完成后系统应执行的自动动作，区分“工作区清理”和“编排调度”两类回调。

## 回调层次

### 1. cleanup callback
作用：清理当前 workspace / repo 运行环境。

典型动作：
- 停止 dev server
- 清理临时文件
- 清理本地缓存
- 回收测试资源

执行位置：
- 优先由 VibeKanban repo 的 `cleanup_script` 承担

### 2. orchestration callback
作用：在任务完成后推进整个任务网络。

典型动作：
- 更新 issue 状态
- 检查下游 `depends_on`
- 解锁 ready task
- 自动创建 follow-up issue
- 自动启动下一 workspace session
- 记录 execution log

执行位置：
- 由元仓库 playbook / script 承担

## 推荐策略枚举

### `cleanup-only`
仅执行清理，不做任务推进。

### `unlock-next-on-done`
任务完成后检查并解锁下游任务。

### `start-next-on-done`
任务完成后若存在唯一 ready 下游任务，则自动启动下一 session。

### `create-followup-on-failure`
若合并失败、验证失败或清理失败，则创建 follow-up issue。

## 触发条件

仅当以下条件满足时，允许触发 orchestration callback：

- 当前 issue 状态为 done
- DoD 已满足或被明确豁免
- 关键验证步骤已完成
- 必要的执行日志已写入

## 安全规则

- 不允许在测试失败时自动启动后续任务
- 不允许在 merge 冲突未决时解锁依赖该任务的核心开发任务
- 自动创建的 follow-up issue 必须带来源 issue_id
