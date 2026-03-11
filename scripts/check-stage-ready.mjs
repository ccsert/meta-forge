#!/usr/bin/env node
import { existsSync } from 'node:fs';
import path from 'node:path';
import { parseArgs, fail } from './lib/cli.mjs';
import { readText } from './lib/fs.mjs';
import { fromYaml } from './lib/yaml.mjs';

/*
 * check-stage-ready.mjs
 *
 * 检查指定项目是否满足进入下一阶段的前置条件。
 *
 * 用法:
 *   node scripts/check-stage-ready.mjs --project <project-id> [--stage <1-8>]
 *
 * 若省略 --stage，自动推断当前最高已完成阶段。
 */

const STAGES = [
  {
    id: 1,
    name: '项目定义',
    requiredDocs: ['project_definition'],
    checks: ['has_goals', 'has_user_roles', 'has_features']
  },
  {
    id: 2,
    name: '架构初始化',
    requiredDocs: ['architecture'],
    checks: ['has_system_boundary', 'has_modules', 'has_tech_stack']
  },
  {
    id: 3,
    name: '任务拆解',
    requiredDocs: ['task_breakdown'],
    checks: ['has_epics', 'has_tasks', 'has_depends_on']
  },
  {
    id: 4,
    name: '仓库初始化',
    requiredDocs: [],
    checks: ['has_repository_url', 'has_local_path']
  },
  {
    id: 5,
    name: '文档注入',
    requiredDocs: [],
    checks: ['has_manifest', 'has_issue_map']
  },
  {
    id: 6,
    name: 'VibeKanban 绑定',
    requiredDocs: [],
    checks: ['has_organization_id', 'has_project_id', 'has_repo_id']
  },
  {
    id: 7,
    name: '注册表更新',
    requiredDocs: [],
    checks: ['registry_entry_exists']
  },
  {
    id: 8,
    name: '迭代执行',
    requiredDocs: [],
    checks: ['has_ready_tasks']
  }
];

function resolveDocPath(project, docKey) {
  const docPointers = project.docs || {};
  return docPointers[docKey] || '';
}

function fileExists(basePath, filePath) {
  if (!filePath) return false;
  const resolved = path.isAbsolute(filePath) ? filePath : path.join(basePath, filePath);
  return existsSync(resolved);
}

function contentContains(text, keywords) {
  if (!text) return false;
  const lower = text.toLowerCase();
  return keywords.some((kw) => lower.includes(kw.toLowerCase()));
}

async function tryReadDoc(basePath, docPath) {
  if (!docPath) return null;
  const resolved = path.isAbsolute(docPath) ? docPath : path.join(basePath, docPath);
  try {
    return await readText(resolved);
  } catch {
    return null;
  }
}

async function checkStage(stageId, project, basePath) {
  const stage = STAGES.find((s) => s.id === stageId);
  if (!stage) return { stage: stageId, passed: false, errors: ['未知阶段'] };

  const errors = [];
  const warnings = [];

  // 检查必需文档是否存在
  for (const docKey of stage.requiredDocs) {
    const docPath = resolveDocPath(project, docKey);
    if (!docPath) {
      errors.push(`docs.${docKey} 未在注册表中配置`);
    } else if (!fileExists(basePath, docPath)) {
      errors.push(`文档不存在: ${docPath}`);
    }
  }

  // 按阶段执行内容级检查
  if (stageId === 1) {
    const defPath = resolveDocPath(project, 'project_definition');
    const content = await tryReadDoc(basePath, defPath);
    if (content) {
      if (!contentContains(content, ['目标', 'goal', 'objective'])) errors.push('project-definition 缺少"目标"章节');
      if (!contentContains(content, ['用户', 'user', 'role', '角色'])) warnings.push('project-definition 未明确用户角色');
      if (!contentContains(content, ['功能', 'feature', '核心'])) warnings.push('project-definition 未明确核心功能');
    }
  }

  if (stageId === 2) {
    const archPath = resolveDocPath(project, 'architecture');
    const content = await tryReadDoc(basePath, archPath);
    if (content) {
      if (!contentContains(content, ['系统边界', 'system boundary', 'context'])) warnings.push('architecture 未定义系统边界');
      if (!contentContains(content, ['模块', 'module', '组件', 'component'])) warnings.push('architecture 未定义模块划分');
      if (!contentContains(content, ['技术选型', 'tech stack', '技术栈'])) warnings.push('architecture 未说明技术选型');
    }
  }

  if (stageId === 3) {
    const tbPath = resolveDocPath(project, 'task_breakdown');
    const content = await tryReadDoc(basePath, tbPath);
    if (content) {
      if (!contentContains(content, ['epic', 'EPIC'])) errors.push('task-breakdown 缺少 Epic 层级');
      if (!contentContains(content, ['task', 'TASK'])) errors.push('task-breakdown 缺少 Task 层级');
      if (!contentContains(content, ['depends_on', '依赖'])) warnings.push('task-breakdown 未声明依赖关系');
    }
  }

  if (stageId === 4) {
    const repo = project.repository || {};
    if (!repo.repo_url && !repo.github_name) errors.push('repository.repo_url 或 github_name 未配置');
    if (!repo.local_path) warnings.push('repository.local_path 未配置');
  }

  if (stageId === 5) {
    const docs = project.docs || {};
    if (!docs.issue_map) errors.push('docs.issue_map 未配置');
  }

  if (stageId === 6) {
    const vk = project.vibekanban || {};
    if (!vk.organization_id) errors.push('vibekanban.organization_id 未配置');
    if (!vk.project_id) errors.push('vibekanban.project_id 未配置');
    if (!vk.repo_id) errors.push('vibekanban.repo_id 未配置');
  }

  if (stageId === 7) {
    // 直接通过：如果能走到这里，说明注册表条目已存在
  }

  return {
    stage: stageId,
    name: stage.name,
    passed: errors.length === 0,
    errors,
    warnings
  };
}

function detectCurrentStage(project, basePath) {
  // 倒序检测：从最高阶段往下找到第一个未完成的
  const docs = project.docs || {};
  const repo = project.repository || {};
  const vk = project.vibekanban || {};

  if (!resolveDocPath(project, 'project_definition') ||
      !fileExists(basePath, resolveDocPath(project, 'project_definition'))) return 1;
  if (!resolveDocPath(project, 'architecture') ||
      !fileExists(basePath, resolveDocPath(project, 'architecture'))) return 2;
  if (!resolveDocPath(project, 'task_breakdown') ||
      !fileExists(basePath, resolveDocPath(project, 'task_breakdown'))) return 3;
  if (!repo.repo_url && !repo.github_name) return 4;
  if (!docs.issue_map) return 5;
  if (!vk.organization_id || !vk.project_id) return 6;
  return 8; // 已就绪，进入迭代执行
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const projectId = args.project;
  const registryPath = args.registry || 'projects/registry.yaml';

  if (!projectId) {
    fail('INPUT_ERROR', '缺少必要参数', {
      required: ['--project'],
      example: 'node scripts/check-stage-ready.mjs --project xhs-draft-platform --stage 3'
    });
  }

  const registryText = await readText(registryPath).catch((error) =>
    fail('INPUT_ERROR', '读取注册表失败', { message: error.message, path: registryPath })
  );
  const registry = fromYaml(registryText);
  const projects = registry.projects || [];
  const project = projects.find((p) => p.id === projectId);

  if (!project) {
    fail('NOT_FOUND', `项目不存在: ${projectId}`, {
      available: projects.map((p) => p.id)
    });
  }

  const basePath = process.cwd();
  const requestedStage = args.stage ? Number(args.stage) : null;
  const currentStage = detectCurrentStage(project, basePath);

  if (requestedStage) {
    // 检查指定阶段
    const result = await checkStage(requestedStage, project, basePath);
    const output = {
      project_id: projectId,
      current_stage: currentStage,
      checked_stage: requestedStage,
      ...result,
      next_action: result.passed
        ? `阶段 ${requestedStage} 已就绪，可以进入阶段 ${requestedStage + 1}`
        : `阶段 ${requestedStage} 未就绪，需修复以上错误`
    };
    console.log(JSON.stringify(output, null, 2));
  } else {
    // 自动检测：检查当前阶段和前置阶段
    const results = [];
    for (let i = 1; i <= currentStage; i++) {
      results.push(await checkStage(i, project, basePath));
    }

    const allPassed = results.every((r) => r.passed);
    const output = {
      project_id: projectId,
      project_name: project.name,
      project_status: project.status,
      detected_stage: currentStage,
      stage_name: STAGES.find((s) => s.id === currentStage)?.name || '未知',
      all_passed: allPassed,
      stages: results,
      next_action: allPassed
        ? `所有前置阶段已通过，当前处于阶段 ${currentStage}（${STAGES.find((s) => s.id === currentStage)?.name}）`
        : '存在未通过的阶段检查，需先修复'
    };
    console.log(JSON.stringify(output, null, 2));
  }
}

await main();
