import type { TasksResponse } from '~~/shared/types/sync'

export function useTaskStatus() {
  const { data, error, pending, refresh } = useFetch<TasksResponse>('/api/tasks')
  const tasks = computed(() => data.value?.data ?? [])
  const generatedAt = computed(() => data.value?.generated_at ?? null)
  const unavailable = computed(() => !pending.value && (!!error.value || !data.value))

  onMounted(() => {
    const timer = setInterval(() => {
      if (document.visibilityState === 'visible') refresh()
    }, 60000)
    onUnmounted(() => clearInterval(timer))
  })

  return { tasks, generatedAt, unavailable, pending, refresh }
}
