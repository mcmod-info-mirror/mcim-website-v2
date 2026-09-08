import type { BuildInfo } from '~~/shared/types/api'

export default defineCachedEventHandler(async (event) => {
  const config = useRuntimeConfig(event)
  const root = await fetchUpstream<{ build: BuildInfo }>(event, config.mcimApiBase, '/')
  return root.build
}, { maxAge: 300, swr: true, name: 'build' })
