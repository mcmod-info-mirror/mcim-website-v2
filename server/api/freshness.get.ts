import type { FreshnessResponse } from '~~/shared/types/freshness'

const loadFreshness = cachedUpstream({ name: 'freshness', maxAge: 300, staleFor: 1800 }, async (event): Promise<FreshnessResponse> => {
  const config = useRuntimeConfig(event)
  const raw = await fetchUpstream<unknown>(event, config.syncApiBase, '/api/freshness')
  return normalizeFreshness(raw)
})

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig(event)
  if (!config.syncApiBase) throw createError({ statusCode: 503, statusMessage: 'sync api not configured', data: { error: 'sync api not configured' } })
  return loadFreshness(event)
})
