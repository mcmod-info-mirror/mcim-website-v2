import type { TaskRun, TasksResponse } from '~~/shared/types/sync'

let warned = false

export default defineCachedEventHandler(async (event): Promise<TasksResponse> => {
  const config = useRuntimeConfig(event)
  const base = config.syncApiBase
  if (!base) {
    if (!warned) {
      console.warn('[tasks] NUXT_SYNC_API_BASE is not set; sync status will show as unknown')
      warned = true
    }
    throw createError({ statusCode: 503, statusMessage: 'sync api not configured', data: { error: 'sync api not configured' } })
  }
  const scheduled = await fetchUpstream<{ data: { task: string, next_run_at: string }[] }>(event, base, '/api/tasks')
  const latest: Record<string, TaskRun | null> = {}
  const success: Record<string, TaskRun | null> = {}
  await Promise.all(scheduled.data.map(async ({ task }) => {
    // 单个任务的历史查不到只让它显示未知，不拖垮整页
    try {
      const [l, s] = await Promise.all([
        fetchUpstream<{ data: unknown[] }>(event, base, '/api/task-runs', { task, limit: 1 }),
        fetchUpstream<{ data: unknown[] }>(event, base, '/api/task-runs', { task, status: 'success', limit: 1 }),
      ])
      latest[task] = l.data[0] ? normalizeTaskRun(l.data[0]) : null
      success[task] = s.data[0] ? normalizeTaskRun(s.data[0]) : null
    }
    catch {
      latest[task] = null
      success[task] = null
    }
  }))
  return { data: mergeTaskOverview(scheduled.data, latest, success) }
}, { maxAge: 30, swr: true, name: 'tasks' })
