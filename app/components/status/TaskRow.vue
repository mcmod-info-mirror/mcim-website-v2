<script setup lang="ts">
import type { TaskOverview } from '~~/shared/types/sync'

const props = defineProps<{ item: TaskOverview }>()
const { t, locale } = useI18n()

const status = computed(() => displayStatus(props.item.latest))
const showLastSuccess = computed(() => status.value.key !== 'success' && !!props.item.latest_success)

const summary = computed(() => {
  const run = props.item.latest
  if (!run) return []
  const parts: [string, number][] = [
    [t('status.attempted'), run.total],
    [t('status.synced'), run.synced],
    [t('status.failed'), run.failed],
  ]
  if (props.item.provider === 'modrinth') {
    parts.push([t('status.versions'), run.versions], [t('status.files'), run.files])
  }
  return parts
})
</script>

<template>
  <NuxtLink
    :to="`/status/${item.task}`"
    class="task-row"
  >
    <span class="task-row__name">
      <code>{{ item.task }}</code>
      <span class="task-row__label muted">{{ taskLabel(item.task, locale) }}</span>
    </span>
    <span class="task-row__status">
      <StatusBadge :run="item.latest" />
    </span>
    <span class="task-row__cell">
      <span class="task-row__cell-label">{{ t('status.col_last_success') }}</span>
      <UiRelativeTime
        v-if="showLastSuccess"
        :iso="item.latest_success!.finished_at"
      />
      <span
        v-else
        class="faint"
      >—</span>
    </span>
    <span class="task-row__cell">
      <span class="task-row__cell-label">{{ t('status.col_next_run') }}</span>
      <UiRelativeTime :iso="item.next_run_at" />
    </span>
    <span class="task-row__summary">
      <span
        v-for="[label, value] in summary"
        :key="label"
      >{{ label }} {{ formatNumber(value, locale) }}</span>
    </span>
    <span class="task-row__duration">
      {{ formatDuration(item.latest?.duration_ms ?? null, locale) }}
    </span>
  </NuxtLink>
</template>
