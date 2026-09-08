import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'
import { normalizeTaskRun } from '../../server/utils/task-runs'

const fixture = JSON.parse(readFileSync(new URL('../fixtures/sync/task-runs.json', import.meta.url), 'utf8')) as { data: unknown[], count: number }
const STATUSES = ['running', 'success', 'partial_failure', 'error', 'interrupted']

describe('recorded task-runs fixture', () => {
  it('normalizes every recorded run', () => {
    expect(fixture.data.length).toBe(fixture.count)
    for (const raw of fixture.data) {
      const run = normalizeTaskRun(raw)
      expect(run.id).toMatch(/^[0-9a-f]{24}$/)
      expect(STATUSES).toContain(run.status)
      expect(Date.parse(run.started_at)).not.toBeNaN()
      if (run.status === 'running') expect(run.finished_at).toBeNull()
      else expect(Date.parse(run.finished_at ?? '')).not.toBeNaN()
    }
  })
})
