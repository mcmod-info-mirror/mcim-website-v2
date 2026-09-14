import type { TasksResponse } from '~~/shared/types/sync'

/// 一次取回最近的运行历史再按任务归类，比逐任务查两次少十几个上游请求。
/// 250 条约覆盖 30 小时，够每天只跑一次的任务落进窗口；再多就会逼近上游超时。
const RUNS_LIMIT = 250

let warned = false

const loadTasks = cachedUpstream({ name: 'tasks', maxAge: 30, staleFor: 300 }, async (event): Promise<TasksResponse> => {
  const config = useRuntimeConfig(event)
  const base = config.syncApiBase
  if (!base) {
    if (!warned) {
      console.warn('[tasks] NUXT_SYNC_API_BASE is not set; sync status will show as unknown')
      warned = true
    }
    throw createError({ statusCode: 503, statusMessage: 'sync api not configured', data: { error: 'sync api not configured' } })
  }
  const [scheduled, history] = await Promise.all([
    fetchUpstream<{ data: { task: string, next_run_at: string }[] }>(event, base, '/api/tasks'),
    fetchUpstream<{ data: unknown[] }>(event, base, '/api/task-runs', { limit: RUNS_LIMIT }),
  ])
  const { latest, success } = indexLatestRuns(history.data)
  return {
    generated_at: new Date().toISOString(),
    data: mergeTaskOverview(scheduled.data, latest, success),
  }
})

export default defineEventHandler(loadTasks)
