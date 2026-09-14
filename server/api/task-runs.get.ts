import type { TaskRunsResponse } from '~~/shared/types/sync'

const loadRuns = cachedUpstream({
  name: 'task-runs',
  maxAge: 30,
  staleFor: 300,
  getKey: event => `${getQuery(event).task}-${Number(getQuery(event).limit) || 50}`.replace(/[^\w-]/g, ''),
}, async (event): Promise<TaskRunsResponse> => {
  const config = useRuntimeConfig(event)
  const query = getQuery(event)
  const task = String(query.task ?? '')
  const limit = Math.min(500, Math.max(1, Number(query.limit) || 50))
  const raw = await fetchUpstream<{ data: unknown[], count: number }>(event, config.syncApiBase, '/api/task-runs', { task, limit })
  const data = raw.data.map(normalizeTaskRun)
  return { data, count: data.length }
})

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig(event)
  if (!config.syncApiBase) throw createError({ statusCode: 503, statusMessage: 'sync api not configured', data: { error: 'sync api not configured' } })
  if (!/^[a-z0-9-]+$/.test(String(getQuery(event).task ?? ''))) throw createError({ statusCode: 400, statusMessage: 'invalid task' })
  return loadRuns(event)
})
