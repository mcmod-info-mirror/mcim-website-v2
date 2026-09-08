import { describe, expect, it } from 'vitest'
import { mergeTaskOverview, normalizeDate, normalizeTaskRun } from '../../server/utils/task-runs'

const extended = {
  _id: { $oid: '68be0c1a2f3e4d5a6b7c8d9e' },
  task: 'modrinth-refresh',
  provider: 'modrinth',
  operation: 'refresh',
  status: 'success',
  started_at: { $date: { $numberLong: '1757325600000' } },
  finished_at: { $date: { $numberLong: '1757325900000' } },
  duration_ms: 300000,
  total: 10,
  synced: 8,
  not_found: 1,
  skipped: 1,
  failed: 0,
  requeued: 0,
  versions: 20,
  files: 25,
  discovered: 0,
  removed: 0,
  error: null,
  version: '0.3.0',
}

describe('normalizeDate', () => {
  it('accepts extended json, relaxed json, iso and millis', () => {
    expect(normalizeDate({ $date: { $numberLong: '1757325600000' } })).toBe('2025-09-08T10:00:00.000Z')
    expect(normalizeDate({ $date: '2025-09-08T10:00:00Z' })).toBe('2025-09-08T10:00:00.000Z')
    expect(normalizeDate('2025-09-08T10:00:00Z')).toBe('2025-09-08T10:00:00.000Z')
    expect(normalizeDate(1757325600000)).toBe('2025-09-08T10:00:00.000Z')
    expect(normalizeDate(null)).toBeNull()
    expect(normalizeDate('nope')).toBeNull()
  })
})

describe('normalizeTaskRun', () => {
  it('flattens extended json ids and dates', () => {
    const run = normalizeTaskRun(extended)
    expect(run.id).toBe('68be0c1a2f3e4d5a6b7c8d9e')
    expect(run.started_at).toBe('2025-09-08T10:00:00.000Z')
    expect(run.finished_at).toBe('2025-09-08T10:05:00.000Z')
    expect(run.synced).toBe(8)
  })

  it('keeps plain string ids and null finished_at', () => {
    const run = normalizeTaskRun({ ...extended, _id: 'abc', finished_at: null, status: 'running' })
    expect(run.id).toBe('abc')
    expect(run.finished_at).toBeNull()
  })

  it('defaults missing counters to zero', () => {
    const run = normalizeTaskRun({ task: 'x', status: 'error', started_at: '2025-09-08T10:00:00Z' })
    expect(run.total).toBe(0)
    expect(run.error).toBeNull()
  })
})

describe('mergeTaskOverview', () => {
  it('keeps /api/tasks order and infers provider from name when no run exists', () => {
    const merged = mergeTaskOverview(
      [
        { task: 'curseforge-queue', next_run_at: '2025-09-08T11:00:00Z' },
        { task: 'modrinth-refresh', next_run_at: '2025-09-08T12:00:00Z' },
      ],
      { 'modrinth-refresh': normalizeTaskRun(extended) },
      {},
    )
    expect(merged.map(m => m.task)).toEqual(['curseforge-queue', 'modrinth-refresh'])
    expect(merged[0]).toMatchObject({ provider: 'curseforge', operation: 'queue', latest: null, latest_success: null })
    expect(merged[1]?.latest?.status).toBe('success')
    expect(merged[1]?.latest_success).toBeNull()
  })
})
