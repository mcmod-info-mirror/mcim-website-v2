<script setup lang="ts">
import type { TaskOverview } from '~~/shared/types/sync'
import type { BuildInfo } from '~~/shared/types/api'

const props = defineProps<{ tasks: TaskOverview[], generatedAt: string | null }>()
const { t } = useI18n()
const { data: build } = useFetch<BuildInfo>('/api/build', { lazy: true, server: false })

const counts = computed(() => {
  const c = { success: 0, running: 0, partial: 0, failed: 0 }
  for (const task of props.tasks) {
    const token = displayStatus(task.latest).token
    if (token in c) c[token as keyof typeof c]++
  }
  return c
})

const syncVersion = computed(() => props.tasks.find(x => x.latest?.version)?.latest?.version ?? null)
</script>

<template>
  <div class="summary-bar">
    <div class="summary-bar__counts">
      <span class="summary-item">
        <strong>{{ tasks.length }}</strong> {{ t('status.summary_total') }}
      </span>
      <span class="summary-item">
        <span class="dot dot--success" /><strong>{{ counts.success }}</strong> {{ t('status.summary_success') }}
      </span>
      <span class="summary-item">
        <span class="dot dot--running" /><strong>{{ counts.running }}</strong> {{ t('status.summary_running') }}
      </span>
      <span class="summary-item">
        <span class="dot dot--partial" /><strong>{{ counts.partial }}</strong> {{ t('status.summary_partial') }}
      </span>
      <span
        class="summary-item"
        :class="{ 'pill pill--failed': counts.failed > 0 }"
      >
        <span class="dot dot--failed" /><strong>{{ counts.failed }}</strong> {{ t('status.summary_failed') }}
      </span>
    </div>
    <div class="summary-bar__meta faint">
      <span v-if="build">{{ t('status.versions_api') }} {{ build.version }} {{ build.commit }}</span>
      <span v-if="syncVersion">{{ t('status.versions_sync') }} {{ syncVersion }}</span>
      <span v-if="generatedAt">{{ t('status.generated') }} <UiRelativeTime :iso="generatedAt" /></span>
    </div>
  </div>
</template>
