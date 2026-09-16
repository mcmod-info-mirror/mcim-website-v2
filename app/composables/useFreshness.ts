import type { FreshnessResponse } from '~~/shared/types/freshness'

/// 取数放在页面层而不是面板组件里：子组件的 onServerPrefetch 要等父组件的解析完才开始，
/// 同一个组件上注册的多个 prefetch 才会并发，冷缓存时能省掉一次上游往返的时间。
export function useFreshness() {
  const { data } = useFetch<FreshnessResponse>('/api/freshness')
  const collections = computed(() => data.value?.collections ?? [])
  return { collections }
}
