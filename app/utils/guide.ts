export const GUIDE_CATEGORIES = ['start', 'platform', 'semantics', 'rules'] as const
export type GuideCategory = typeof GUIDE_CATEGORIES[number]

export function guideCategory(path: string): string {
  return path.split('/')[2] ?? ''
}

export function sortGuideIndex<T extends { path: string, order?: number }>(items: T[]): T[] {
  const rank = (p: string) => {
    const i = GUIDE_CATEGORIES.indexOf(guideCategory(p) as GuideCategory)
    return i === -1 ? GUIDE_CATEGORIES.length : i
  }
  return [...items].sort((a, b) => rank(a.path) - rank(b.path) || (a.order ?? 0) - (b.order ?? 0))
}
