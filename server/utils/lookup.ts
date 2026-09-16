import type { LookupPlatform, LookupResult, LookupTranslation } from '~~/shared/types/lookup'

type Json = Record<string, unknown>

/// CurseForge 的是数字 modId，Modrinth 的是 base62 的 project id 或短横线 slug
const ID_PATTERN: Record<LookupPlatform, RegExp> = {
  curseforge: /^\d{1,12}$/,
  modrinth: /^[\w.-]{1,64}$/,
}

export function isPlatform(value: unknown): value is LookupPlatform {
  return value === 'curseforge' || value === 'modrinth'
}

export function isLookupId(platform: LookupPlatform, id: string): boolean {
  return ID_PATTERN[platform].test(id)
}

function asObject(value: unknown): Json {
  return typeof value === 'object' && value !== null ? value as Json : {}
}

function text(value: unknown): string {
  return typeof value === 'string' ? value : ''
}

function moment(value: unknown): string | null {
  const ms = Date.parse(String(value ?? ''))
  return Number.isFinite(ms) ? new Date(ms).toISOString() : null
}

export function normalizeTranslation(raw: unknown): LookupTranslation | null {
  const item = asObject(raw)
  const translated = text(item.translated)
  if (!translated) return null
  return { translated, original: text(item.original), translated_at: moment(item.translated_at) }
}

export function normalizeCurseforge(raw: unknown, base: string, files: number | null): LookupResult {
  const mod = asObject(asObject(raw).data)
  const id = String(mod.id ?? '')
  return {
    platform: 'curseforge',
    id,
    slug: text(mod.slug) || null,
    name: text(mod.name) || id,
    summary: text(mod.summary),
    icon_url: text(asObject(mod.logo).thumbnailUrl) || null,
    website_url: text(asObject(mod.links).websiteUrl) || null,
    mirror_url: `${base}/curseforge/v1/mods/${id}`,
    sync_at: moment(mod.sync_at),
    checked_at: moment(mod.checked_at),
    updated_at: moment(mod.dateModified),
    count: files,
    count_kind: 'files',
    translation: null,
  }
}

export function normalizeModrinth(raw: unknown, base: string): LookupResult {
  const project = asObject(raw)
  const id = text(project.id)
  const slug = text(project.slug)
  return {
    platform: 'modrinth',
    id,
    slug: slug || null,
    name: text(project.title) || id,
    summary: text(project.description),
    icon_url: text(project.icon_url) || null,
    website_url: slug ? `https://modrinth.com/project/${slug}` : null,
    mirror_url: `${base}/modrinth/v2/project/${slug || id}`,
    sync_at: moment(project.sync_at),
    checked_at: moment(project.checked_at),
    updated_at: moment(project.updated),
    // 项目响应里的 versions 就是版本 id 列表，数长度即可，不必再查一次
    count: Array.isArray(project.versions) ? project.versions.length : null,
    count_kind: 'versions',
    translation: null,
  }
}
