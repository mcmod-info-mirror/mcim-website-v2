import type { H3Event } from 'h3'

export async function fetchUpstream<T>(event: H3Event, base: string, path: string, query?: Record<string, string | number>): Promise<T> {
  const config = useRuntimeConfig(event)
  try {
    return (await $fetch(path, {
      baseURL: base,
      query,
      timeout: Number(config.upstreamTimeoutMs),
      headers: { 'user-agent': config.upstreamUserAgent, 'accept': 'application/json' },
    })) as T
  }
  catch (error) {
    console.warn(`[upstream] ${base}${path} failed: ${(error as Error).message}`)
    throw createError({ statusCode: 502, statusMessage: 'upstream unavailable', data: { error: 'upstream unavailable' } })
  }
}
