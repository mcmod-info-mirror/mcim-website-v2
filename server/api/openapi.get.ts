const loadOpenapi = cachedUpstream({ name: 'openapi', maxAge: 3600, staleFor: 86400 }, async (event) => {
  const config = useRuntimeConfig(event)
  return await fetchUpstream<Record<string, unknown>>(event, config.mcimApiBase, '/openapi.json')
})

export default defineEventHandler(loadOpenapi)
