import type { Statistics } from '~~/shared/types/api'

const loadStatistics = cachedUpstream({ name: 'statistics', maxAge: 60, staleFor: 600 }, async (event) => {
  const config = useRuntimeConfig(event)
  return await fetchUpstream<Statistics>(event, config.mcimApiBase, '/statistics')
})

export default defineEventHandler(loadStatistics)
