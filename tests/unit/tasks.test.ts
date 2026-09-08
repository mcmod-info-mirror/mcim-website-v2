import { describe, expect, it } from 'vitest'
import type { TaskRun } from '../../shared/types/sync'
import { displayStatus, taskLabel, taskOperation, taskPlatform } from '../../app/utils/tasks'

describe('tasks', () => {
  it('maps known tasks to labels', () => {
    expect(taskLabel('modrinth-refresh-full', 'zh-CN')).toBe('全量刷新')
    expect(taskLabel('curseforge-queue', 'en')).toBe('Queue')
  })

  it('falls back to the raw operation for unknown tasks', () => {
    expect(taskLabel('modrinth-nightly', 'zh-CN')).toBe('nightly')
    expect(taskOperation('nightly')).toBe('nightly')
    expect(taskPlatform('nightly')).toBe('other')
    expect(taskPlatform('curseforge-search')).toBe('curseforge')
  })

  it('maps run status to display status', () => {
    expect(displayStatus(null)).toEqual({ key: 'unknown', token: 'unknown', at: null })
    expect(displayStatus({ status: 'running', started_at: 'a', finished_at: null } as TaskRun)).toEqual({ key: 'running', token: 'running', at: 'a' })
    expect(displayStatus({ status: 'partial_failure', started_at: 'a', finished_at: 'b' } as TaskRun).token).toBe('partial')
    expect(displayStatus({ status: 'error', started_at: 'a', finished_at: 'b' } as TaskRun).token).toBe('failed')
    expect(displayStatus({ status: 'interrupted', started_at: 'a', finished_at: 'b' } as TaskRun).token).toBe('unknown')
    expect(displayStatus({ status: 'weird', started_at: 'a', finished_at: 'b' } as TaskRun).key).toBe('unknown')
  })
})
