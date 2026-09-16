import type { LookupResult } from '~~/shared/types/lookup'

/// CurseForge 的 modId 三个接口通用，一起发；翻译和文件数取不到不算失败，缺就缺了
async function optional<T>(load: Promise<T>): Promise<T | null> {
  return load.catch(() => null)
}

export default defineEventHandler(async (event): Promise<LookupResult> => {
  const config = useRuntimeConfig(event)
  const base = config.mcimApiBase
  const query = getQuery(event)
  const platform = String(query.platform ?? '')
  const id = String(query.id ?? '').trim()

  if (!isPlatform(platform)) throw createError({ statusCode: 400, statusMessage: 'unknown platform', data: { error: 'unknown platform' } })
  if (!isLookupId(platform, id)) throw createError({ statusCode: 400, statusMessage: 'invalid id', data: { error: 'invalid id' } })

  if (platform === 'curseforge') {
    const [detail, files, translation] = await Promise.all([
      fetchUpstream<unknown>(event, base, `/curseforge/v1/mods/${id}`),
      optional(fetchUpstream<{ pagination?: { totalCount?: number } }>(event, base, `/curseforge/v1/mods/${id}/files`, { index: 0, pageSize: 1 })),
      optional(fetchUpstream<unknown>(event, base, `/translate/curseforge/${id}`)),
    ])
    const result = normalizeCurseforge(detail, config.public.apiUrl, files?.pagination?.totalCount ?? null)
    return { ...result, translation: normalizeTranslation(translation) }
  }

  // Modrinth 的翻译接口只认 project_id，用户填 slug 时并发发出去必然落空，所以先拿详情再用真实 id 去查
  const result = normalizeModrinth(await fetchUpstream<unknown>(event, base, `/modrinth/v2/project/${id}`), config.public.apiUrl)
  const translation = result.id ? await optional(fetchUpstream<unknown>(event, base, `/translate/modrinth/${result.id}`)) : null
  return { ...result, translation: normalizeTranslation(translation) }
})
