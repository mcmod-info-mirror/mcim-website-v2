import type { ReferenceDoc } from '~~/shared/types/reference'

/// 上游规范 45 KB 且一半是页面用不上的 schema 细节，归一化后只剩 27 KB，浏览器也不必再解析一遍
const loadReference = cachedUpstream({ name: 'reference', maxAge: 3600, staleFor: 86400 }, async (event): Promise<ReferenceDoc> => {
  const config = useRuntimeConfig(event)
  const raw = await fetchUpstream<unknown>(event, config.mcimApiBase, '/openapi.json')
  return normalizeReference(raw, config.public.apiUrl)
})

export default defineEventHandler(loadReference)
