<script setup lang="ts">
import type { Sponsor } from '~~/shared/types/api'

const { t, locale } = useI18n()
const config = useRuntimeConfig()

useHead({ script: [{ src: 'https://js.stripe.com/v3/buy-button.js', async: true }] })
useSeoMeta({ title: t('sponsor.title'), description: t('sponsor.intro') })

const { data: sponsors } = await useFetch<Sponsor[]>('/api/sponsors')
const total = computed(() => (sponsors.value ?? []).reduce((sum, s) => sum + s.amount, 0))
</script>

<template>
  <div class="page">
    <h1>{{ t('sponsor.title') }}</h1>
    <p class="lead">
      {{ t('sponsor.intro') }}
    </p>

    <div class="sponsor-stats">
      <div class="sponsor-stat">
        <strong>¥{{ formatNumber(total, locale) }}</strong>
        <span class="muted">{{ t('sponsor.total') }}</span>
      </div>
      <div class="sponsor-stat">
        <strong>{{ sponsors?.length ?? 0 }}</strong>
        <span class="muted">{{ t('sponsor.count') }}</span>
      </div>
    </div>

    <div class="sponsor-cards">
      <mdui-card
        variant="outlined"
        class="sponsor-card"
      >
        <div class="card-body">
          <h2>{{ t('sponsor.pay_title') }}</h2>
          <p class="muted">
            {{ t('sponsor.pay_desc') }}
          </p>
          <ClientOnly>
            <stripe-buy-button
              :buy-button-id="config.public.stripeBuyButtonId"
              :publishable-key="config.public.stripePublishableKey"
            />
          </ClientOnly>
        </div>
      </mdui-card>
      <mdui-card
        variant="outlined"
        class="sponsor-card"
      >
        <div class="card-body">
          <h2>{{ t('sponsor.quick_title') }}</h2>
          <p class="muted">
            {{ t('sponsor.quick_desc') }}
          </p>
          <mdui-button
            variant="filled"
            href="https://donate.stripe.com/dRmcN64pEbSL6VD7gVgIo02"
            rel="noopener"
            target="_blank"
          >
            {{ t('sponsor.quick_button') }}
          </mdui-button>
        </div>
      </mdui-card>
    </div>

    <h2>{{ t('sponsor.use_title') }}</h2>
    <dl class="sponsor-uses">
      <dt>{{ t('sponsor.use_server') }}</dt>
      <dd>{{ t('sponsor.use_server_desc') }}</dd>
      <dt>{{ t('sponsor.use_dev') }}</dt>
      <dd>{{ t('sponsor.use_dev_desc') }}</dd>
    </dl>

    <h2>{{ t('sponsor.thanks_title') }}</h2>
    <p class="muted">
      {{ t('sponsor.thanks_desc') }}
    </p>
    <table>
      <thead>
        <tr>
          <th>{{ t('sponsor.col_name') }}</th>
          <th class="num">
            {{ t('sponsor.col_amount') }}
          </th>
          <th>{{ t('sponsor.col_date') }}</th>
          <th>{{ t('sponsor.col_message') }}</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="(s, i) in sponsors"
          :key="i"
        >
          <td>{{ s.name }}</td>
          <td class="num">
            ¥{{ s.amount }}
          </td>
          <td class="muted">
            {{ s.date }}
          </td>
          <td>{{ s.message || '—' }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style scoped>
.sponsor-stats {
  display: flex;
  gap: 24px;
  margin: 0 0 20px;
}

.sponsor-stat {
  display: flex;
  flex-direction: column;
  padding: 0 0 0 12px;
  border-left: 3px solid var(--brand-purple);
}

.sponsor-stat strong {
  font-size: 24px;
}

.sponsor-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 12px;
  margin: 0 0 24px;
}

.sponsor-card {
  display: block;
}

.sponsor-uses {
  margin: 0 0 24px;
}

.sponsor-uses dt {
  font-weight: 700;
}

.sponsor-uses dd {
  margin: 0 0 8px;
  color: var(--text-muted);
}

.num {
  text-align: right;
}
</style>
