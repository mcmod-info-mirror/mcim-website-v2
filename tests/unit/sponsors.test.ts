import { describe, expect, it } from 'vitest'
import { publicSponsors } from '../../server/utils/sponsors'

describe('publicSponsors', () => {
  it('drops everything except name, amount, date and message', () => {
    const out = publicSponsors([{ name: 'a', amount: 10, date: '2025-08-26', message: '', email: 'a@example.com' }])
    expect(Object.keys(out[0]!)).toEqual(['name', 'amount', 'date', 'message'])
    expect(JSON.stringify(out)).not.toContain('@')
  })
})
