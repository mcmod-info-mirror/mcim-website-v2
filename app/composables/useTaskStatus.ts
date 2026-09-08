import type { TasksResponse } from '~~/shared/types/sync'

export function useTaskStatus() {
  const { data, error, pending, refresh } = useFetch<TasksResponse>('/api/tasks')
  const tasks = computed(() => data.value?.data ?? [])
  const unavailable = computed(() => !!error.value || !data.value)

  onMounted(() => {
    const timer = setInterval(() => {
      if (document.visibilityState === 'visible') refresh()
    }, 60000)
    onUnmounted(() => clearInterval(timer))
  })

  return { tasks, unavailable, pending, refresh }
}
