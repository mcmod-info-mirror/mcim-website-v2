import type { H3Event } from 'h3'

/// 缓存过期后 Nitro 会先端出旧值再后台刷新，上游长期失败时旧值会被无限期端出去，
/// 页面也就一直不报错。超过陈旧上限就判定失效，改为等新值，拿不到就让错误浮上来。
export function freshFor(seconds: number) {
  return (entry: { value?: unknown, mtime?: number }) =>
    entry.value !== undefined && Date.now() - (entry.mtime ?? 0) < seconds * 1000
}

/// 只有 defineCachedFunction 认 validate，defineCachedEventHandler 会用自己的那个覆盖掉，
/// 所以缓存包在取数函数上，路由本身保持普通处理器。
export function cachedUpstream<T>(
  options: { name: string, maxAge: number, staleFor: number, getKey?: (event: H3Event) => string },
  load: (event: H3Event) => Promise<T>,
) {
  return defineCachedFunction(load, {
    name: options.name,
    maxAge: options.maxAge,
    swr: true,
    getKey: options.getKey ?? (() => options.name),
    validate: freshFor(options.staleFor),
  })
}
