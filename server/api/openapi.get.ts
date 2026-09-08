export default defineCachedEventHandler(async (event) => {
  const config = useRuntimeConfig(event)
  return await fetchUpstream<Record<string, unknown>>(event, config.mcimApiBase, '/openapi.json')
}, { maxAge: 3600, swr: true, name: 'openapi' })
