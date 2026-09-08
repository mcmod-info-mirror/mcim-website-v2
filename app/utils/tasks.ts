import type { TaskRun } from '~~/shared/types/sync'

export type Platform = 'curseforge' | 'modrinth' | 'other'

const LABELS: Record<string, { 'zh-CN': string, 'en': string }> = {
  'queue': { 'zh-CN': '队列补抓', 'en': 'Queue' },
  'refresh': { 'zh-CN': '增量刷新', 'en': 'Incremental refresh' },
  'refresh-full': { 'zh-CN': '全量刷新', 'en': 'Full refresh' },
  'search': { 'zh-CN': '新条目发现', 'en': 'Discovery' },
  'categories': { 'zh-CN': '分类刷新', 'en': 'Categories' },
  'tags': { 'zh-CN': '标签刷新', 'en': 'Tags' },
}

export function taskPlatform(task: string): Platform {
  if (task.startsWith('curseforge')) return 'curseforge'
  if (task.startsWith('modrinth')) return 'modrinth'
  return 'other'
}

export function taskOperation(task: string): string {
  return task.replace(/^(curseforge|modrinth)-?/, '') || task
}

export function taskLabel(task: string, locale: string): string {
  const op = taskOperation(task)
  const entry = LABELS[op]
  if (!entry) return op
  return locale.startsWith('zh') ? entry['zh-CN'] : entry.en
}

export type DisplayToken = 'running' | 'success' | 'partial' | 'failed' | 'unknown'
export type DisplayKey = 'running' | 'success' | 'partial_failure' | 'error' | 'interrupted' | 'unknown'

const TOKENS: Record<string, [DisplayKey, DisplayToken]> = {
  running: ['running', 'running'],
  success: ['success', 'success'],
  partial_failure: ['partial_failure', 'partial'],
  error: ['error', 'failed'],
  interrupted: ['interrupted', 'unknown'],
}

export function displayStatus(run: TaskRun | null): { key: DisplayKey, token: DisplayToken, at: string | null } {
  if (!run) return { key: 'unknown', token: 'unknown', at: null }
  const [key, token] = TOKENS[run.status] ?? ['unknown', 'unknown']
  return { key, token, at: key === 'running' ? run.started_at : run.finished_at }
}
