export type TaskStatus = 'running' | 'success' | 'partial_failure' | 'error' | 'interrupted'

export interface TaskRun {
  id: string
  task: string
  provider: string
  operation: string
  status: TaskStatus | string
  started_at: string
  finished_at: string | null
  duration_ms: number | null
  total: number
  synced: number
  not_found: number
  skipped: number
  failed: number
  requeued: number
  versions: number
  files: number
  discovered: number
  removed: number
  error: string | null
  version: string
}

export interface TaskOverview {
  task: string
  provider: string
  operation: string
  next_run_at: string | null
  latest: TaskRun | null
  latest_success: TaskRun | null
}

export interface TasksResponse {
  data: TaskOverview[]
}

export interface TaskRunsResponse {
  data: TaskRun[]
  count: number
}
