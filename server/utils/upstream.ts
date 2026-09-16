import type { H3Event } from 'h3'

export async function fetchUpstream<T>(event: H3Event, base: string, path: string, query?: Record<string, string | number>): Promise<T> {
  const config = useRuntimeConfig(event)
  try {
    // 取的是外部地址，用不上 Nitro 的内部路由类型匹配；不写死 string 的话路由一多就把类型递归撑爆
    return (await $fetch<T, string>(path, {
      baseURL: base,
      query,
      timeout: Number(config.upstreamTimeoutMs),
      headers: { 'user-agent': config.upstreamUserAgent, 'accept': 'application/json' },
    })) as T
  }
  catch (error) {
    // 上游的 404 是「缓存里没有这一条」，不是上游出故障，查询工具要能分开这两件事
    const status = (error as { status?: number, statusCode?: number }).status ?? (error as { statusCode?: number }).statusCode
    if (status === 404) throw createError({ statusCode: 404, statusMessage: 'not found', data: { error: 'not found' } })
    console.warn(`[upstream] ${base}${path} failed: ${(error as Error).message}`)
    throw createError({ statusCode: 502, statusMessage: 'upstream unavailable', data: { error: 'upstream unavailable' } })
  }
}
