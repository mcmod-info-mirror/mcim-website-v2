import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'
import { isLookupId, isPlatform, normalizeCurseforge, normalizeModrinth, normalizeTranslation } from '../../server/utils/lookup'

const load = (name: string) => JSON.parse(readFileSync(new URL(`../fixtures/api/${name}.json`, import.meta.url), 'utf8'))
const BASE = 'https://mod.mcimirror.top'

describe('isPlatform', () => {
  it('takes only the two platforms we mirror', () => {
    expect(isPlatform('curseforge')).toBe(true)
    expect(isPlatform('modrinth')).toBe(true)
    expect(isPlatform('MODRINTH')).toBe(false)
    expect(isPlatform(undefined)).toBe(false)
  })
})

describe('isLookupId', () => {
  it('takes digits for curseforge and refuses anything else', () => {
    expect(isLookupId('curseforge', '238222')).toBe(true)
    expect(isLookupId('curseforge', 'jei')).toBe(false)
    expect(isLookupId('curseforge', '')).toBe(false)
    expect(isLookupId('curseforge', '1'.repeat(13))).toBe(false)
  })

  it('takes ids and slugs for modrinth and refuses path tricks', () => {
    expect(isLookupId('modrinth', 'AANobbMI')).toBe(true)
    expect(isLookupId('modrinth', 'fabric-api')).toBe(true)
    expect(isLookupId('modrinth', '../../statistics')).toBe(false)
    expect(isLookupId('modrinth', 'a b')).toBe(false)
    expect(isLookupId('modrinth', 'x'.repeat(65))).toBe(false)
  })
})

describe('normalizeTranslation', () => {
  it('reads a recorded translation', () => {
    const translation = normalizeTranslation(load('modrinth-translation'))!
    expect(translation.translated).toContain('渲染引擎')
    expect(translation.original).toContain('rendering engine')
    expect(translation.translated_at).toBe('2026-06-01T07:30:34.909Z')
  })

  it('reports nothing rather than an empty translation', () => {
    expect(normalizeTranslation({ translated: '', original: 'x' })).toBeNull()
    expect(normalizeTranslation(null)).toBeNull()
  })
})

describe('normalizeCurseforge', () => {
  const result = normalizeCurseforge(load('curseforge-mod'), BASE, 3635)

  it('pulls the identity and the cache dates out of the recording', () => {
    expect(result).toMatchObject({
      platform: 'curseforge',
      id: '238222',
      slug: 'jei',
      name: 'Just Enough Items (JEI)',
      count: 3635,
      count_kind: 'files',
      sync_at: '2026-09-16T07:00:01.834Z',
      website_url: 'https://www.curseforge.com/minecraft/mc-mods/jei',
      mirror_url: 'https://mod.mcimirror.top/curseforge/v1/mods/238222',
    })
    expect(result.checked_at).not.toBeNull()
    expect(result.updated_at).not.toBeNull()
  })

  it('reports no file count when the extra query failed', () => {
    expect(normalizeCurseforge(load('curseforge-mod'), BASE, null).count).toBeNull()
  })

  it('survives a response with nothing in it', () => {
    const empty = normalizeCurseforge({}, BASE, null)
    expect(empty.name).toBe('')
    expect(empty.sync_at).toBeNull()
    expect(empty.website_url).toBeNull()
  })
})

describe('normalizeModrinth', () => {
  const result = normalizeModrinth(load('modrinth-project'), BASE)

  it('counts the versions off the project response instead of querying again', () => {
    expect(result.count).toBe(258)
    expect(result.count_kind).toBe('versions')
  })

  it('keeps sync_at and checked_at apart', () => {
    expect(result.sync_at).toBe('2026-09-16T06:10:08.325Z')
    expect(result.checked_at).toBe('2026-09-16T06:15:04.311Z')
  })

  it('builds the links from the slug', () => {
    expect(result).toMatchObject({
      platform: 'modrinth',
      id: 'AANobbMI',
      slug: 'sodium',
      name: 'Sodium',
      website_url: 'https://modrinth.com/project/sodium',
      mirror_url: 'https://mod.mcimirror.top/modrinth/v2/project/sodium',
    })
  })

  it('falls back to the id when there is no slug', () => {
    const result = normalizeModrinth({ id: 'AANobbMI', versions: [] }, BASE)
    expect(result.slug).toBeNull()
    expect(result.website_url).toBeNull()
    expect(result.mirror_url).toBe('https://mod.mcimirror.top/modrinth/v2/project/AANobbMI')
    expect(result.count).toBe(0)
  })
})
