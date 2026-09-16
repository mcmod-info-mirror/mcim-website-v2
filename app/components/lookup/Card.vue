<script setup lang="ts">
import type { LookupResult } from '~~/shared/types/lookup'

const props = defineProps<{ result: LookupResult }>()
const { t, locale } = useI18n()

const facts = computed(() => [
  { key: 'sync_at', iso: props.result.sync_at },
  { key: 'checked_at', iso: props.result.checked_at },
  { key: 'updated_at', iso: props.result.updated_at },
])
</script>

<template>
  <article class="lookup-card">
    <header class="lookup-card__head">
      <img
        v-if="result.icon_url"
        class="lookup-card__icon"
        :src="result.icon_url"
        alt=""
        width="56"
        height="56"
        loading="lazy"
      >
      <div class="lookup-card__title">
        <h2>{{ result.name }}</h2>
        <p class="muted">
          {{ result.summary }}
        </p>
        <p class="lookup-card__ids faint">
          <code>{{ result.id }}</code>
          <code v-if="result.slug && result.slug !== result.id">{{ result.slug }}</code>
          <span v-if="result.count !== null">{{ t(`lookup.${result.count_kind}`) }} {{ formatNumber(result.count, locale) }}</span>
        </p>
      </div>
    </header>

    <dl class="lookup-facts">
      <div
        v-for="fact in facts"
        :key="fact.key"
      >
        <dt>{{ t(`lookup.${fact.key}`) }}</dt>
        <dd>
          <UiRelativeTime :iso="fact.iso" />
        </dd>
      </div>
    </dl>

    <section class="lookup-card__block">
      <h3>{{ t('lookup.translation') }}</h3>
      <template v-if="result.translation">
        <p>{{ result.translation.translated }}</p>
        <p class="faint">
          {{ t('lookup.translated_at') }} <UiRelativeTime :iso="result.translation.translated_at" />
        </p>
      </template>
      <p
        v-else
        class="muted"
      >
        {{ t('lookup.translation_none') }}
      </p>
    </section>

    <p class="lookup-card__links">
      <a
        v-if="result.website_url"
        :href="result.website_url"
        target="_blank"
        rel="noopener"
      >{{ t('lookup.website') }}</a>
      <a
        :href="result.mirror_url"
        target="_blank"
        rel="noopener"
      >{{ t('lookup.mirror') }}</a>
    </p>
  </article>
</template>
