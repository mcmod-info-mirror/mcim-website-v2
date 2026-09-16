export type FreshnessBandKey = 'h2' | 'h24' | 'd7' | 'older' | 'never'

export interface FreshnessBand {
  key: FreshnessBandKey
  count: number
}

export interface FreshnessCollection {
  key: string
  total: number
  bands: FreshnessBand[]
  oldest_checked_at: string | null
  newest_sync_at: string | null
}

export interface FreshnessResponse {
  generated_at: string
  collections: FreshnessCollection[]
}
