import type { FreshnessBand, FreshnessCollection, FreshnessResponse } from '~~/shared/types/freshness'

type Json = Record<string, unknown>

/// 与状态页的任务分组同序，未知集合按字母序接在后面
const COLLECTION_ORDER = ['curseforge_mods', 'modrinth_projects']

function count(value: unknown): number {
  return typeof value === 'number' && Number.isFinite(value) && value > 0 ? Math.trunc(value) : 0
}

function moment(value: unknown): string | null {
  const ms = Date.parse(String(value ?? ''))
  return Number.isFinite(ms) ? new Date(ms).toISOString() : null
}

/// 上游那三个桶是累计的（2h 包含在 24h 里，24h 包含在 7d 里），画分段条要的是互不重叠的区间。
/// 三个数是分别查出来的，中间隔着几秒就可能对不齐，所以逐级取上界再夹到非负。
export function toBands(total: number, within: { h2: number, h24: number, d7: number }, never: number): FreshnessBand[] {
  const h2 = Math.min(within.h2, total)
  const h24 = Math.min(Math.max(within.h24, h2), total)
  const d7 = Math.min(Math.max(within.d7, h24), total)
  const rest = total - d7
  const unchecked = Math.min(never, rest)
  return [
    { key: 'h2', count: h2 },
    { key: 'h24', count: h24 - h2 },
    { key: 'd7', count: d7 - h24 },
    { key: 'older', count: rest - unchecked },
    { key: 'never', count: unchecked },
  ]
}

export function normalizeFreshness(raw: unknown): FreshnessResponse {
  const doc = (raw ?? {}) as Json
  const collections: FreshnessCollection[] = []

  for (const [key, value] of Object.entries((doc.collections ?? {}) as Json)) {
    const item = (value ?? {}) as Json
    const within = (item.checked_within ?? {}) as Json
    const total = count(item.total)
    collections.push({
      key,
      total,
      bands: toBands(total, { h2: count(within['2h']), h24: count(within['24h']), d7: count(within['7d']) }, count(item.never_checked)),
      oldest_checked_at: moment(item.oldest_checked_at),
      newest_sync_at: moment(item.newest_sync_at),
    })
  }

  const rank = (key: string) => {
    const index = COLLECTION_ORDER.indexOf(key)
    return index === -1 ? COLLECTION_ORDER.length : index
  }
  collections.sort((a, b) => rank(a.key) - rank(b.key) || a.key.localeCompare(b.key))

  return { generated_at: moment(doc.generated_at) ?? new Date().toISOString(), collections }
}
