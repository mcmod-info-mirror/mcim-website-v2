<script setup lang="ts">
import type { Statistics } from '~~/shared/types/api'

const { t, locale } = useI18n()
const { data, refresh } = await useFetch<Statistics>('/api/statistics')

onMounted(() => {
  const timer = setInterval(() => {
    if (document.visibilityState === 'visible') refresh()
  }, 60000)
  onUnmounted(() => clearInterval(timer))
})

const n = (v: number | undefined) => (v == null ? '—' : formatNumber(v, locale.value))

const cards = computed(() => {
  const s = data.value
  return [
    {
      key: 'modrinth',
      name: t('home.stats_modrinth'),
      main: n(s?.modrinth.project),
      unit: t('home.stats_projects'),
      rows: [
        [t('home.stats_versions'), n(s?.modrinth.version)],
        [t('home.stats_files'), n(s?.modrinth.file)],
        [t('home.stats_translated'), n(s?.translate.modrinth)],
      ],
    },
    {
      key: 'curseforge',
      name: t('home.stats_curseforge'),
      main: n(s?.curseforge.mod),
      unit: t('home.stats_mods'),
      rows: [
        [t('home.stats_files'), n(s?.curseforge.file)],
        [t('home.stats_translated'), n(s?.translate.curseforge)],
      ],
    },
  ]
})
</script>

<template>
  <div class="stats">
    <mdui-card
      v-for="card in cards"
      :key="card.key"
      variant="filled"
      class="stats__card"
    >
      <div class="card-body stats__body">
        <div class="stats__name">
          {{ card.name }}
        </div>
        <div class="stats__main">
          <strong>{{ card.main }}</strong>
          <span class="muted">{{ card.unit }}</span>
        </div>
        <dl class="stats__rows">
          <div
            v-for="[label, value] in card.rows"
            :key="label"
            class="stats__row"
          >
            <dt>{{ label }}</dt>
            <dd>{{ value }}</dd>
          </div>
        </dl>
        <div
          class="stats__line"
          aria-hidden="true"
        />
      </div>
    </mdui-card>
  </div>
</template>

<style scoped>
.stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 12px;
}

.stats__card {
  display: block;
}

.stats__body {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.stats__line {
  height: 4px;
  border-radius: 2px;
  background: var(--gradient-brand);
  margin-top: auto;
}

.stats__name {
  font-size: 13px;
  font-weight: 700;
  color: var(--text-muted);
}

.stats__main {
  display: flex;
  align-items: baseline;
  gap: 6px;
  margin: 4px 0 8px;
}

.stats__main strong {
  font-size: 28px;
  font-weight: 700;
  letter-spacing: -.01em;
}

.stats__rows {
  margin: 0 0 14px;
  font-size: 13px;
}

.stats__row {
  display: flex;
  justify-content: space-between;
  gap: 8px;
  padding: 2px 0;
}

.stats__row dt {
  color: var(--text-muted);
}

.stats__row dd {
  margin: 0;
  font-variant-numeric: tabular-nums;
}
</style>
