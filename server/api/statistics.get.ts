import type { Statistics } from '~~/shared/types/api'

export default defineCachedEventHandler(async (event) => {
  const config = useRuntimeConfig(event)
  return await fetchUpstream<Statistics>(event, config.mcimApiBase, '/statistics')
}, { maxAge: 60, swr: true, name: 'statistics' })
