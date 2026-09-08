export function formatNumber(n: number, locale: string): string {
  return new Intl.NumberFormat(locale).format(n)
}

export function formatPercent(part: number, whole: number): string {
  if (!whole) return '0.0%'
  return `${Math.min(100, (part / whole) * 100).toFixed(1)}%`
}

export function formatDuration(ms: number | null, locale: string): string {
  if (ms == null) return '—'
  const s = Math.round(ms / 1000)
  const zh = locale.startsWith('zh')
  if (s < 60) return zh ? `${s} 秒` : `${s}s`
  const m = Math.floor(s / 60)
  if (m < 60) return zh ? `${m} 分 ${s % 60} 秒` : `${m}m ${s % 60}s`
  const h = Math.floor(m / 60)
  return zh ? `${h} 小时 ${m % 60} 分` : `${h}h ${m % 60}m`
}

export function formatRelative(iso: string | null, now: number, locale: string): string {
  if (!iso) return '—'
  const diff = Date.parse(iso) - now
  if (!Number.isFinite(diff)) return '—'
  if (Math.abs(diff) < 60000) return locale.startsWith('zh') ? '刚刚' : 'just now'
  const rtf = new Intl.RelativeTimeFormat(locale, { numeric: 'always' })
  const abs = Math.abs(diff)
  if (abs < 3600000) return rtf.format(Math.round(diff / 60000), 'minute')
  if (abs < 86400000) return rtf.format(Math.round(diff / 3600000), 'hour')
  return rtf.format(Math.round(diff / 86400000), 'day')
}

export function formatDateTime(iso: string | null, locale: string): string {
  if (!iso) return '—'
  return new Intl.DateTimeFormat(locale, { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(iso))
}
