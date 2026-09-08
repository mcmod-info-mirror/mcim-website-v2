<script setup lang="ts">
const { t } = useI18n()
const config = useRuntimeConfig()
const { effective } = useTheme()

const failed = ref(false)
const attempt = ref(0)

function retry() {
  failed.value = false
  attempt.value++
}

useSeoMeta({ title: t('docs.title') })
</script>

<template>
  <div class="page page--full docs">
    <p class="docs__intro">
      {{ t('docs.intro') }} <code>{{ config.public.apiUrl }}</code>
      · <a
        :href="`${config.public.apiUrl}/docs`"
        rel="noopener"
      >{{ t('docs.swagger_fallback') }}</a>
    </p>
    <div
      v-if="!failed"
      class="docs__reference"
    >
      <DocsScalarReference
        :dark="effective === 'dark'"
        :attempt="attempt"
        :api-url="config.public.apiUrl"
        @error="failed = true"
      >
        <template #fallback>
          <p class="docs__intro muted">
            {{ t('docs.loading') }}
          </p>
        </template>
      </DocsScalarReference>
    </div>
    <p
      v-else
      class="banner docs__intro"
    >
      {{ t('docs.retry') }}
      <mdui-button
        variant="tonal"
        @click="retry"
      >
        {{ t('docs.retry_button') }}
      </mdui-button>
    </p>
  </div>
</template>

<style scoped>
.docs__intro {
  margin: 0;
  padding: 10px 20px;
  border-bottom: 1px solid var(--border);
  font-size: 13px;
  color: var(--text-muted);
}

.docs__reference {
  min-height: 60vh;
}
</style>
