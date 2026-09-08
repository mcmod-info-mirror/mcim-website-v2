import { describe, expect, it } from 'vitest'
import { formatDuration, formatNumber, formatPercent, formatRelative } from '../../app/utils/format'

describe('format', () => {
  it('formats numbers with separators', () => {
    expect(formatNumber(1391861, 'en')).toBe('1,391,861')
  })

  it('formats percent to one decimal and guards zero', () => {
    expect(formatPercent(165516, 156676)).toBe('100.0%')
    expect(formatPercent(1, 0)).toBe('0.0%')
  })

  it('formats durations', () => {
    expect(formatDuration(45000, 'en')).toBe('45s')
    expect(formatDuration(300000, 'en')).toBe('5m 0s')
    expect(formatDuration(3900000, 'en')).toBe('1h 5m')
    expect(formatDuration(null, 'en')).toBe('—')
  })

  it('formats relative time', () => {
    const now = Date.parse('2026-09-08T12:00:00Z')
    expect(formatRelative('2026-09-08T11:59:40Z', now, 'en')).toBe('just now')
    expect(formatRelative('2026-09-08T11:30:00Z', now, 'en')).toBe('30 minutes ago')
    expect(formatRelative('2026-09-08T12:17:00Z', now, 'en')).toBe('in 17 minutes')
    expect(formatRelative('2026-09-08T11:30:00Z', now, 'zh-CN')).toBe('30分钟前')
    expect(formatRelative(null, now, 'en')).toBe('—')
  })
})
