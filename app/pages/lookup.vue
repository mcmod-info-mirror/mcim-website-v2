<script setup lang="ts">
import type { LookupResult } from '~~/shared/types/lookup'

const { t } = useI18n()
const route = useRoute()
const router = useRouter()

const platform = computed(() => (route.query.platform === 'curseforge' ? 'curseforge' : 'modrinth'))
const id = computed(() => String(route.query.id ?? '').trim())

// 用固定 key 的 useAsyncData 而不是 useFetch：useFetch 把查询参数算进 key，
// 参数一变 key 就变，而 immediate 为假时 Nuxt 不会为 key 变化重新取数，提交表单就没反应了。
const { data, error, pending } = await useAsyncData('lookup', () => (
  id.value ? $fetch<LookupResult>('/api/lookup', { query: { platform: platform.value, id: id.value } }) : Promise.resolve(null)
), { watch: [platform, id] })

const status = computed(() => error.value?.statusCode ?? 0)

const examples = [
  { platform: 'modrinth', id: 'sodium' },
  { platform: 'modrinth', id: 'AANobbMI' },
  { platform: 'curseforge', id: '238222' },
]

// 无 JS 时表单按原生 GET 提交，有 JS 就走客户端路由，两边落到同一个地址
function submit(event: Event) {
  const form = new FormData(event.target as HTMLFormElement)
  router.push({ path: '/lookup', query: { platform: String(form.get('platform') ?? 'modrinth'), id: String(form.get('id') ?? '').trim() } })
}

useSeoMeta({ title: t('lookup.title'), description: t('lookup.intro') })
</script>

<template>
  <div class="page">
    <h1>{{ t('lookup.title') }}</h1>
    <p class="lead">
      {{ t('lookup.intro') }}
    </p>

    <form
      class="lookup-form"
      method="get"
      action="/lookup"
      @submit.prevent="submit"
    >
      <fieldset class="lookup-form__platforms">
        <legend class="visually-hidden">
          {{ t('lookup.platform') }}
        </legend>
        <label
          v-for="key in ['modrinth', 'curseforge']"
          :key="key"
          class="lookup-choice"
        >
          <input
            type="radio"
            name="platform"
            :value="key"
            :checked="platform === key"
          >
          <span>{{ t(`status.group_${key}`) }}</span>
        </label>
      </fieldset>

      <label class="lookup-form__field">
        <span class="visually-hidden">{{ t('lookup.id_label') }}</span>
        <input
          name="id"
          type="text"
          autocapitalize="off"
          autocomplete="off"
          spellcheck="false"
          :value="id"
          :placeholder="t('lookup.id_placeholder')"
        >
      </label>

      <button
        type="submit"
        class="lookup-form__submit"
      >
        {{ t('lookup.submit') }}
      </button>
    </form>

    <p class="lookup-hint muted">
      {{ t('lookup.id_hint') }}
      <span class="lookup-examples">
        {{ t('lookup.examples') }}
        <NuxtLink
          v-for="example in examples"
          :key="`${example.platform}-${example.id}`"
          :to="{ path: '/lookup', query: example }"
        >
          {{ example.id }}
        </NuxtLink>
      </span>
    </p>

    <div
      v-if="pending"
      class="status-loading"
      role="status"
      aria-live="polite"
    >
      <mdui-linear-progress />
      <span class="muted">{{ t('lookup.loading') }}</span>
    </div>

    <div
      v-else-if="status === 404"
      class="banner"
      role="status"
    >
      <strong>{{ t('lookup.miss_title') }}</strong>
      {{ t('lookup.miss_body') }}
      <NuxtLink to="/guide/semantics/freshness">
        {{ t('lookup.miss_guide') }}
      </NuxtLink>
    </div>

    <div
      v-else-if="status === 400"
      class="banner"
      role="status"
    >
      {{ t('lookup.invalid') }}
    </div>

    <div
      v-else-if="status"
      class="banner"
      role="status"
    >
      {{ t('lookup.failed') }}
    </div>

    <LookupCard
      v-else-if="data"
      :result="data"
    />

    <p
      v-else
      class="muted"
    >
      {{ t('lookup.empty') }}
    </p>
  </div>
</template>
