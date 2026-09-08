import type { TaskOverview, TaskRun } from '~~/shared/types/sync'

export function normalizeDate(value: unknown): string | null {
  if (value == null) return null
  if (typeof value === 'object') {
    const inner = (value as { $date?: unknown }).$date
    if (inner == null) return null
    if (typeof inner === 'object') return normalizeDate((inner as { $numberLong?: string }).$numberLong)
    return normalizeDate(inner)
  }
  const text = String(value)
  const ms = typeof value === 'number' ? value : /^\d+$/.test(text) ? Number(text) : Date.parse(text)
  return Number.isFinite(ms) ? new Date(ms).toISOString() : null
}

function id(value: unknown): string {
  if (typeof value === 'object' && value !== null && '$oid' in value) return String((value as { $oid: unknown }).$oid)
  return value == null ? '' : String(value)
}

function num(value: unknown): number {
  return typeof value === 'number' && Number.isFinite(value) ? value : 0
}

export function taskProvider(task: string): string {
  if (task.startsWith('curseforge')) return 'curseforge'
  if (task.startsWith('modrinth')) return 'modrinth'
  return 'other'
}

export function taskOperation(task: string): string {
  return task.replace(/^(curseforge|modrinth)-?/, '') || task
}

export function normalizeTaskRun(raw: unknown): TaskRun {
  const r = (raw ?? {}) as Record<string, unknown>
  const task = String(r.task ?? '')
  return {
    id: id(r._id ?? r.id),
    task,
    provider: String(r.provider ?? taskProvider(task)),
    operation: String(r.operation ?? taskOperation(task)),
    status: String(r.status ?? 'unknown'),
    started_at: normalizeDate(r.started_at) ?? '',
    finished_at: normalizeDate(r.finished_at),
    duration_ms: typeof r.duration_ms === 'number' ? r.duration_ms : null,
    total: num(r.total),
    synced: num(r.synced),
    not_found: num(r.not_found),
    skipped: num(r.skipped),
    failed: num(r.failed),
    requeued: num(r.requeued),
    versions: num(r.versions),
    files: num(r.files),
    discovered: num(r.discovered),
    removed: num(r.removed),
    error: typeof r.error === 'string' ? r.error : null,
    version: String(r.version ?? ''),
  }
}

export function mergeTaskOverview(
  tasks: { task: string, next_run_at?: unknown }[],
  latest: Record<string, TaskRun | null | undefined>,
  success: Record<string, TaskRun | null | undefined>,
): TaskOverview[] {
  return tasks.map(({ task, next_run_at }) => {
    const run = latest[task] ?? null
    return {
      task,
      provider: run?.provider ?? taskProvider(task),
      operation: run?.operation ?? taskOperation(task),
      next_run_at: normalizeDate(next_run_at),
      latest: run,
      latest_success: success[task] ?? null,
    }
  })
}
