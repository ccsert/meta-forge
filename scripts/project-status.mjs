#!/usr/bin/env node
import { existsSync, readdirSync, statSync } from 'node:fs';
import path from 'node:path';
import { parseArgs, fail } from './lib/cli.mjs';
import { readText } from './lib/fs.mjs';
import { fromYaml } from './lib/yaml.mjs';

/*
 * project-status.mjs
 *
 * 输出项目仪表盘：阶段进度、任务统计、最近执行记录。
 *
 * 用法:
 *   node scripts/project-status.mjs --project <project-id>
 *   node scripts/project-status.mjs  # 列出所有项目概览
 */

const STAGE_NAMES = {
  1: '项目定义',
  2: '架构初始化',
  3: '任务拆解',
  4: '仓库初始化',
  5: '文档注入',
  6: 'VibeKanban 绑定',
  7: '注册表更新',
  8: '迭代执行'
};

const DONE_STATUSES = new Set(['done', 'completed', 'closed', 'resolved']);

function detectStage(project) {
  const docs = project.docs || {};
  const repo = project.repository || {};
  const vk = project.vibekanban || {};

  if (!docs.project_definition) return 1;
  if (!docs.architecture) return 2;
  if (!docs.task_breakdown) return 3;
  if (!repo.repo_url && !repo.github_name) return 4;
  if (!docs.issue_map) return 5;
  if (!vk.organization_id || !vk.project_id) return 6;
  return 8;
}

function buildProgressBar(current, total) {
  const filled = current;
  const empty = total - current;
  return '[' + '█'.repeat(filled) + '░'.repeat(empty) + ']';
}

async function loadTaskStats(statusPath) {
  if (!statusPath || !existsSync(statusPath)) {
    return null;
  }
  try {
    const text = await readText(statusPath);
    const snapshot = fromYaml(text);
    const statuses = snapshot.statuses || [];
    const total = statuses.length;
    const done = statuses.filter((s) => DONE_STATUSES.has(String(s.status || '').toLowerCase())).length;
    const blocked = statuses.filter((s) => String(s.status || '').toLowerCase() === 'blocked').length;
    const inProgress = statuses.filter((s) => String(s.status || '').toLowerCase() === 'in_progress').length;
    const open = total - done - blocked - inProgress;
    return { total, done, blocked, in_progress: inProgress, open };
  } catch {
    return null;
  }
}

function listRecentSessions(projectId) {
  const runsDir = path.join('runs', projectId);
  if (!existsSync(runsDir)) return [];

  const sessions = [];
  try {
    const entries = readdirSync(runsDir);
    for (const entry of entries) {
      const entryPath = path.join(runsDir, entry);
      const stat = statSync(entryPath);
      if (stat.isDirectory()) {
        const files = readdirSync(entryPath).filter((f) => f.endsWith('.yaml'));
        for (const file of files) {
          sessions.push({
            issue_id: entry,
            workspace: file.replace('.yaml', ''),
            modified: stat.mtime.toISOString().slice(0, 10)
          });
        }
      }
    }
  } catch {
    // ignore
  }

  return sessions.sort((a, b) => b.modified.localeCompare(a.modified)).slice(0, 5);
}

function printProjectOverview(projects) {
  console.log('');
  console.log('╔══════════════════════════════════════════════════════════╗');
  console.log('║               meta-forge 项目仪表盘                      ║');
  console.log('╚══════════════════════════════════════════════════════════╝');
  console.log('');

  for (const project of projects) {
    const stage = detectStage(project);
    const bar = buildProgressBar(stage, 8);
    const statusIcon = project.status === 'active' ? '🟢'
      : project.status === 'planning' ? '🔵'
      : project.status === 'paused' ? '🟡'
      : '⚪';

    console.log(`${statusIcon} ${project.name || project.id}`);
    console.log(`   ID: ${project.id}  |  状态: ${project.status}  |  类型: ${project.type || '-'}`);
    console.log(`   阶段: ${bar} ${stage}/8 (${STAGE_NAMES[stage]})`);
    console.log('');
  }
}

async function printProjectDetail(project) {
  const stage = detectStage(project);
  const bar = buildProgressBar(stage, 8);

  console.log('');
  console.log('╔══════════════════════════════════════════════════════════╗');
  console.log(`║  ${(project.name || project.id).padEnd(54)}║`);
  console.log('╚══════════════════════════════════════════════════════════╝');
  console.log('');

  // 基本信息
  console.log('📋 基本信息');
  console.log(`   项目 ID:  ${project.id}`);
  console.log(`   状态:     ${project.status}`);
  console.log(`   类型:     ${project.type || '-'}`);
  console.log(`   创建时间: ${project.created_at || '-'}`);
  if (project.tech_stack) {
    console.log(`   技术栈:   ${Array.isArray(project.tech_stack) ? project.tech_stack.join(', ') : project.tech_stack}`);
  }
  console.log('');

  // 阶段进度
  console.log('📊 阶段进度');
  console.log(`   ${bar} ${stage}/8`);
  for (let i = 1; i <= 8; i++) {
    const icon = i < stage ? '✅' : i === stage ? '🔄' : '⬜';
    console.log(`   ${icon} 阶段 ${i}: ${STAGE_NAMES[i]}`);
  }
  console.log('');

  // 任务统计
  const statusPath = path.join('.meta', 'task-status-snapshot.yaml');
  const stats = await loadTaskStats(statusPath);
  if (stats) {
    const pct = stats.total > 0 ? Math.round((stats.done / stats.total) * 100) : 0;
    console.log('📈 任务统计');
    console.log(`   总计: ${stats.total}  |  完成: ${stats.done} (${pct}%)  |  进行中: ${stats.in_progress}  |  阻塞: ${stats.blocked}  |  待开始: ${stats.open}`);
    console.log('');
  }

  // 仓库信息
  const repo = project.repository || {};
  if (repo.repo_url || repo.github_name) {
    console.log('🔗 仓库');
    console.log(`   URL:    ${repo.repo_url || '-'}`);
    console.log(`   本地:   ${repo.local_path || '-'}`);
    console.log(`   分支:   ${repo.default_branch || 'main'}`);
    console.log('');
  }

  // VibeKanban
  const vk = project.vibekanban || {};
  if (vk.organization_id || vk.project_id) {
    console.log('📋 VibeKanban');
    console.log(`   Organization: ${vk.organization_id || '-'}`);
    console.log(`   Project:      ${vk.project_id || '-'}`);
    console.log(`   Repo:         ${vk.repo_id || '-'}`);
    console.log('');
  }

  // 最近执行
  const sessions = listRecentSessions(project.id);
  if (sessions.length > 0) {
    console.log('🕐 最近执行');
    for (const s of sessions) {
      console.log(`   ${s.modified}  ${s.issue_id}  workspace: ${s.workspace}`);
    }
    console.log('');
  }

  // 自动化配置
  const auto = project.automation || {};
  console.log('⚙️  自动化策略');
  console.log(`   Executor:        ${auto.default_executor || 'CODEX'}`);
  console.log(`   Callback Policy: ${auto.callback_policy || 'unlock-next-on-done'}`);
  console.log(`   Merge Policy:    ${auto.merge_policy || 'agent-resolve'}`);
  console.log(`   Auto Start Next: ${auto.auto_start_next_task ?? false}`);
  console.log('');
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const projectId = args.project;
  const registryPath = args.registry || 'projects/registry.yaml';

  const registryText = await readText(registryPath).catch((error) =>
    fail('INPUT_ERROR', '读取注册表失败', { message: error.message, path: registryPath })
  );
  const registry = fromYaml(registryText);
  const projects = registry.projects || [];

  if (!projectId) {
    // 列出所有项目概览
    if (projects.length === 0) {
      console.log('暂无注册项目。');
      return;
    }
    printProjectOverview(projects);
    return;
  }

  const project = projects.find((p) => p.id === projectId);
  if (!project) {
    fail('NOT_FOUND', `项目不存在: ${projectId}`, {
      available: projects.map((p) => p.id)
    });
  }

  await printProjectDetail(project);
}

await main();
