#!/usr/bin/env node

/*
 * meta-cli.mjs — meta-forge 统一 CLI 入口
 *
 * 用法:
 *   node scripts/meta-cli.mjs <command> [options]
 *
 * 命令:
 *   status [--project <id>]          项目仪表盘
 *   stage  --project <id> [--stage]  阶段就绪检查
 *   next   --result ... --batch ...  编排下一个任务
 *   ready  --batch ... --status ...  筛选 ready task
 *   generate --breakdown ... ...     生成 issue batch
 *   render   --batch ... --task ...  渲染任务描述
 *   archive  --input ...             归档 session result
 *   help                             帮助信息
 */

import { spawn } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const COMMANDS = {
  status: {
    script: 'project-status.mjs',
    description: '项目状态仪表盘',
    usage: 'meta status [--project <id>]'
  },
  stage: {
    script: 'check-stage-ready.mjs',
    description: '阶段就绪检查',
    usage: 'meta stage --project <id> [--stage <1-8>]'
  },
  next: {
    script: 'orchestrate-next-task.mjs',
    description: '编排下一个任务',
    usage: 'meta next --result <path> --batch <path> --status <path>'
  },
  ready: {
    script: 'select-ready-task.mjs',
    description: '筛选 ready task',
    usage: 'meta ready --batch <path> --status <path>'
  },
  generate: {
    script: 'generate-issue-batch.mjs',
    description: '生成 issue batch',
    usage: 'meta generate --breakdown <path> --manifest <path>'
  },
  render: {
    script: 'render-issue-description.mjs',
    description: '渲染任务描述',
    usage: 'meta render --batch <path> --task <id>'
  },
  archive: {
    script: 'archive-session-result.mjs',
    description: '归档 session result',
    usage: 'meta archive --input <path>'
  }
};

function printHelp() {
  console.log('');
  console.log('meta-forge CLI — AI 原生工程元仓库工具集');
  console.log('');
  console.log('用法: npm run meta -- <command> [options]');
  console.log('');
  console.log('可用命令:');
  console.log('');

  const maxLen = Math.max(...Object.keys(COMMANDS).map((k) => k.length));
  for (const [name, cmd] of Object.entries(COMMANDS)) {
    console.log(`  ${name.padEnd(maxLen + 2)} ${cmd.description}`);
    console.log(`  ${''.padEnd(maxLen + 2)} ${cmd.usage}`);
    console.log('');
  }

  console.log('示例:');
  console.log('  npm run meta -- status');
  console.log('  npm run meta -- status --project xhs-draft-platform');
  console.log('  npm run meta -- stage --project xhs-draft-platform');
  console.log('  npm run meta -- next --result .meta/session-result.yaml --batch .meta/vibekanban-issue-batch.yaml --status .meta/task-status-snapshot.yaml');
  console.log('');
}

function main() {
  const argv = process.argv.slice(2);
  const command = argv[0];

  if (!command || command === 'help' || command === '--help' || command === '-h') {
    printHelp();
    process.exit(0);
  }

  const entry = COMMANDS[command];
  if (!entry) {
    console.error(`未知命令: ${command}`);
    console.error('执行 "npm run meta -- help" 查看可用命令');
    process.exit(1);
  }

  const scriptPath = path.join(__dirname, entry.script);
  const childArgs = argv.slice(1);

  const child = spawn(process.execPath, [scriptPath, ...childArgs], {
    stdio: 'inherit',
    cwd: process.cwd()
  });

  child.on('close', (code) => {
    process.exit(code || 0);
  });
}

main();
