<script setup lang="ts">
import type { FreshnessCollection } from '~~/shared/types/freshness'

const props = defineProps<{ collections: FreshnessCollection[] }>()
const { t, te, locale } = useI18n()

const rows = computed(() => props.collections.map(item => ({
  ...item,
  label: te(`status.collection_${item.key}`) ? t(`status.collection_${item.key}`) : item.key,
  visible: item.bands.filter(band => band.count > 0),
})))
</script>

<template>
  <section
    v-if="rows.length"
    class="task-group"
  >
    <h2 class="task-group__title">
      {{ t('status.freshness_title') }}
    </h2>
    <p class="freshness__intro muted">
      <NuxtLink to="/guide/semantics/freshness">
        {{ t('status.freshness_guide') }}
      </NuxtLink>
    </p>

    <div
      v-for="row in rows"
      :key="row.key"
      class="freshness-row"
    >
      <div class="freshness-row__head">
        <span class="freshness-row__name">
          <strong>{{ row.label }}</strong>
          <span class="faint">{{ formatNumber(row.total, locale) }}</span>
        </span>
        <span class="freshness-row__meta faint">
          <span>{{ t('status.freshness_oldest') }} <UiRelativeTime :iso="row.oldest_checked_at" /></span>
          <span>{{ t('status.freshness_synced') }} <UiRelativeTime :iso="row.newest_sync_at" /></span>
        </span>
      </div>

      <div
        class="freshness-bar"
        aria-hidden="true"
      >
        <span
          v-for="band in row.visible"
          :key="band.key"
          class="freshness-bar__band"
          :class="`freshness--${band.key}`"
          :style="{ width: formatPercent(band.count, row.total) }"
        />
      </div>

      <div class="freshness-row__legend">
        <span
          v-for="band in row.visible"
          :key="band.key"
          class="freshness-legend"
        >
          <span
            class="dot"
            :class="`freshness--${band.key}`"
          />
          {{ t(`status.band_${band.key}`) }}
          <strong>{{ formatPercent(band.count, row.total) }}</strong>
          <span class="faint">{{ formatNumber(band.count, locale) }}</span>
        </span>
      </div>
    </div>
  </section>
</template>
