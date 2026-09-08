<script setup lang="ts">
import type { TaskRun } from '~~/shared/types/sync'

defineProps<{ runs: TaskRun[] }>()
const { t, locale } = useI18n()

const short = (text: string | null) => (text && text.length > 120 ? `${text.slice(0, 120)}…` : text ?? '')
</script>

<template>
  <div class="runs-table">
    <table>
      <thead>
        <tr>
          <th>{{ t('status.started_at') }}</th>
          <th>{{ t('status.col_status') }}</th>
          <th>{{ t('status.col_duration') }}</th>
          <th class="num">
            {{ t('status.synced') }}
          </th>
          <th class="num">
            {{ t('status.failed') }}
          </th>
          <th class="num">
            {{ t('status.requeued') }}
          </th>
          <th class="num">
            {{ t('status.discovered') }}
          </th>
          <th class="num">
            {{ t('status.removed') }}
          </th>
          <th>{{ t('status.error') }}</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="run in runs"
          :key="run.id || run.started_at"
        >
          <td>
            <time :datetime="run.started_at">{{ formatDateTime(run.started_at, locale) }}</time>
          </td>
          <td><StatusBadge :run="{ ...run, finished_at: null, started_at: '' }" /></td>
          <td>{{ formatDuration(run.duration_ms, locale) }}</td>
          <td class="num">
            {{ formatNumber(run.synced, locale) }}
          </td>
          <td class="num">
            {{ formatNumber(run.failed, locale) }}
          </td>
          <td class="num">
            {{ formatNumber(run.requeued, locale) }}
          </td>
          <td class="num">
            {{ formatNumber(run.discovered, locale) }}
          </td>
          <td class="num">
            {{ formatNumber(run.removed, locale) }}
          </td>
          <td
            class="runs-table__error"
            :title="run.error ?? undefined"
          >
            {{ short(run.error) }}
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
