import type { TaskRunsResponse } from '~~/shared/types/sync'

export default defineCachedEventHandler(async (event): Promise<TaskRunsResponse> => {
  const config = useRuntimeConfig(event)
  if (!config.syncApiBase) throw createError({ statusCode: 503, statusMessage: 'sync api not configured', data: { error: 'sync api not configured' } })
  const query = getQuery(event)
  const task = String(query.task ?? '')
  if (!/^[a-z0-9-]+$/.test(task)) throw createError({ statusCode: 400, statusMessage: 'invalid task' })
  const limit = Math.min(500, Math.max(1, Number(query.limit) || 50))
  const raw = await fetchUpstream<{ data: unknown[], count: number }>(event, config.syncApiBase, '/api/task-runs', { task, limit })
  const data = raw.data.map(normalizeTaskRun)
  return { data, count: data.length }
}, {
  maxAge: 30,
  swr: true,
  name: 'task-runs',
  getKey: event => `${getQuery(event).task}:${getQuery(event).limit ?? 50}`,
})
