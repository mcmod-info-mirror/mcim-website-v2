<script setup lang="ts">
import type { ReferenceDoc } from '~~/shared/types/reference'

const { t } = useI18n()
const config = useRuntimeConfig()
const swaggerUrl = `${config.public.apiUrl}/docs/`

const { data, error, pending, refresh } = useFetch<ReferenceDoc>('/api/reference')
const groups = computed(() => data.value?.groups ?? [])

useSeoMeta({ title: t('docs.title') })

// 分享出去的链接指向某个操作，浏览器只会滚过去而不会展开，所以进来时自己打开一次
onMounted(() => {
  const id = location.hash.slice(1)
  if (id) document.getElementById(id)?.setAttribute('open', '')
})
</script>

<template>
  <div class="page page--wide">
    <h1>{{ t('docs.title') }}</h1>
    <p class="lead">
      {{ t('docs.intro') }} <code class="code--mirror">{{ config.public.apiUrl }}</code>
      · {{ t('docs.swagger_hint') }}
      <a
        :href="swaggerUrl"
        target="_blank"
        rel="noopener"
      >{{ t('docs.swagger_link') }}</a>
    </p>

    <div
      v-if="!pending && (error || !groups.length)"
      class="banner"
      role="status"
    >
      {{ t('docs.retry') }}
      <mdui-button
        variant="tonal"
        @click="refresh"
      >
        {{ t('docs.retry_button') }}
      </mdui-button>
    </div>
    <div
      v-else-if="pending && !groups.length"
      class="status-loading"
      role="status"
      aria-live="polite"
    >
      <mdui-linear-progress />
      <span class="muted">{{ t('docs.loading') }}</span>
    </div>

    <div
      v-else
      class="ref-cols"
    >
      <DocsGroupNav :groups="groups" />
      <div>
        <section
          v-for="group in groups"
          :key="group.id"
          class="ref-group"
        >
          <h2
            :id="group.id"
            class="ref-group__title"
          >
            {{ group.name }}
          </h2>
          <DocsOperation
            v-for="operation in group.operations"
            :key="operation.id"
            :operation="operation"
            :swagger-url="swaggerUrl"
          />
        </section>
      </div>
    </div>
  </div>
</template>
