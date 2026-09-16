export type LookupPlatform = 'curseforge' | 'modrinth'

export interface LookupTranslation {
  translated: string
  original: string
  translated_at: string | null
}

export interface LookupResult {
  platform: LookupPlatform
  id: string
  slug: string | null
  name: string
  summary: string
  icon_url: string | null
  website_url: string | null
  mirror_url: string
  sync_at: string | null
  checked_at: string | null
  updated_at: string | null
  count: number | null
  count_kind: 'versions' | 'files'
  translation: LookupTranslation | null
}
