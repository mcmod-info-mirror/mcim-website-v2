import { describe, expect, it } from 'vitest'
import { guideCategory, sortGuideIndex } from '../../app/utils/guide'

describe('guide index', () => {
  it('sorts by category order then article order', () => {
    const sorted = sortGuideIndex([
      { path: '/guide/rules/policy', order: 2 },
      { path: '/guide/platform/curseforge', order: 2 },
      { path: '/guide/start/getting-started', order: 1 },
      { path: '/guide/platform/modrinth', order: 1 },
      { path: '/guide/misc/x', order: 1 },
    ])
    expect(sorted.map(s => s.path)).toEqual([
      '/guide/start/getting-started',
      '/guide/platform/modrinth',
      '/guide/platform/curseforge',
      '/guide/rules/policy',
      '/guide/misc/x',
    ])
    expect(guideCategory('/guide/platform/modrinth')).toBe('platform')
  })
})
