import type { BuildInfo } from '~~/shared/types/api'

const loadBuild = cachedUpstream({ name: 'build', maxAge: 300, staleFor: 3600 }, async (event) => {
  const config = useRuntimeConfig(event)
  const root = await fetchUpstream<{ build: BuildInfo }>(event, config.mcimApiBase, '/')
  return root.build
})

export default defineEventHandler(loadBuild)
