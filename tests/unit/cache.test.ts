import { describe, expect, it } from 'vitest'
import { freshFor } from '../../server/utils/cache'

describe('freshFor', () => {
  const validate = freshFor(300)

  it('keeps entries inside the stale window', () => {
    expect(validate({ value: { a: 1 }, mtime: Date.now() - 299_000 })).toBe(true)
  })

  it('rejects entries past the stale window', () => {
    expect(validate({ value: { a: 1 }, mtime: Date.now() - 301_000 })).toBe(false)
  })

  it('rejects entries without a value or a write time', () => {
    expect(validate({ mtime: Date.now() })).toBe(false)
    expect(validate({ value: { a: 1 } })).toBe(false)
  })
})
