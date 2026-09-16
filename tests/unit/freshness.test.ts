import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'
import { normalizeFreshness, toBands } from '../../server/utils/freshness'

const fixture = JSON.parse(readFileSync(new URL('../fixtures/sync/freshness.json', import.meta.url), 'utf8'))

const counts = (bands: { key: string, count: number }[]) => Object.fromEntries(bands.map(band => [band.key, band.count]))

describe('toBands', () => {
  it('splits the cumulative buckets into disjoint bands', () => {
    expect(counts(toBands(1000, { h2: 400, h24: 700, d7: 900 }, 50))).toEqual({ h2: 400, h24: 300, d7: 200, older: 50, never: 50 })
  })

  it('adds up to the total', () => {
    const bands = toBands(1000, { h2: 400, h24: 700, d7: 900 }, 50)
    expect(bands.reduce((sum, band) => sum + band.count, 0)).toBe(1000)
  })

  it('leaves a single band when everything is fresh', () => {
    expect(counts(toBands(500, { h2: 500, h24: 500, d7: 500 }, 0))).toEqual({ h2: 500, h24: 0, d7: 0, older: 0, never: 0 })
  })

  it('never goes negative when the counts race each other', () => {
    const bands = toBands(1000, { h2: 700, h24: 690, d7: 200 }, 0)
    expect(bands.every(band => band.count >= 0)).toBe(true)
    expect(bands.reduce((sum, band) => sum + band.count, 0)).toBe(1000)
  })

  it('caps a bucket that overshoots the total', () => {
    expect(counts(toBands(100, { h2: 400, h24: 400, d7: 400 }, 0))).toEqual({ h2: 100, h24: 0, d7: 0, older: 0, never: 0 })
  })

  it('caps never_checked at what is left outside the 7 day bucket', () => {
    expect(counts(toBands(1000, { h2: 0, h24: 0, d7: 900 }, 500))).toEqual({ h2: 0, h24: 0, d7: 900, older: 0, never: 100 })
  })
})

describe('normalizeFreshness', () => {
  const doc = normalizeFreshness(fixture)

  it('orders the collections the way the task groups are ordered', () => {
    expect(doc.collections.map(collection => collection.key)).toEqual(['curseforge_mods', 'modrinth_projects'])
  })

  it('keeps the totals and the timestamps of the recording', () => {
    const curseforge = doc.collections[0]!
    expect(curseforge.total).toBe(350092)
    expect(curseforge.oldest_checked_at).toBe('2026-09-16T04:30:47.305Z')
    expect(curseforge.newest_sync_at).toBe('2026-09-16T06:20:31.603Z')
    expect(counts(curseforge.bands).h2).toBe(350092)
  })

  it('sorts an unknown collection after the known ones', () => {
    const extra = { collections: { zzz_extra: { total: 1 }, modrinth_projects: { total: 2 }, curseforge_mods: { total: 3 } } }
    expect(normalizeFreshness(extra).collections.map(collection => collection.key))
      .toEqual(['curseforge_mods', 'modrinth_projects', 'zzz_extra'])
  })

  it('survives a response that is missing everything', () => {
    const doc = normalizeFreshness({})
    expect(doc.collections).toEqual([])
    expect(Date.parse(doc.generated_at)).not.toBeNaN()
  })

  it('reports no timestamp rather than an invalid one', () => {
    const doc = normalizeFreshness({ collections: { curseforge_mods: { total: 5, oldest_checked_at: 'nope' } } })
    expect(doc.collections[0]!.oldest_checked_at).toBeNull()
    expect(doc.collections[0]!.newest_sync_at).toBeNull()
  })
})
