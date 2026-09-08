import type { Sponsor } from '~~/shared/types/api'

export function publicSponsors(raw: unknown[]): Sponsor[] {
  return raw.map((item) => {
    const s = item as Record<string, unknown>
    return {
      name: String(s.name ?? ''),
      amount: Number(s.amount ?? 0),
      date: String(s.date ?? ''),
      message: typeof s.message === 'string' ? s.message : '',
    }
  })
}
