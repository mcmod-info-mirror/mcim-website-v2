<script setup lang="ts">
import type { TaskRunsResponse } from '~~/shared/types/sync'

const route = useRoute()
const { t, locale } = useI18n()
const task = String(route.params.task ?? '')
if (!/^[a-z0-9-]+$/.test(task)) throw createError({ statusCode: 404, statusMessage: 'Not found' })

const { data, error } = await useFetch<TaskRunsResponse>('/api/task-runs', { query: { task, limit: 50 } })
const runs = computed(() => data.value?.data ?? [])
const latest = computed(() => runs.value[0] ?? null)

const streak = computed(() => {
  let i = 0
  if (runs.value[0]?.status === 'running') i = 1
  let n = 0
  for (; i < runs.value.length && runs.value[i]?.status === 'error'; i++) n++
  return n
})

useSeoMeta({ title: `${task} · ${t('status.title')}` })
</script>

<template>
  <div class="page page--wide">
    <p>
      <NuxtLink to="/status">
        <Icon name="material-symbols:arrow-back-rounded" /> {{ t('status.back') }}
      </NuxtLink>
    </p>
    <h1 class="task-title">
      <code>{{ task }}</code>
      <span class="muted">{{ taskLabel(task, locale) }}</span>
    </h1>

    <div
      v-if="error"
      class="banner"
      role="status"
    >
      {{ t('status.unavailable') }}
    </div>

    <div class="task-current">
      <StatusBadge
        :run="latest"
        large
      />
      <span
        v-if="streak > 0"
        class="pill pill--failed"
      >{{ t('status.streak', { n: streak }) }}</span>
    </div>

    <h2>
      {{ t('status.history_title') }}
      <span class="faint">{{ t('status.history_count', { n: runs.length }) }}</span>
    </h2>
    <StatusTaskRunsTable
      v-if="runs.length"
      :runs="runs"
    />
    <p
      v-else
      class="muted"
    >
      {{ t('status.no_runs') }}
    </p>
  </div>
</template>
