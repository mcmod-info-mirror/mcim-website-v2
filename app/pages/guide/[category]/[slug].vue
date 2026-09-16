<script setup lang="ts">
const route = useRoute()
const { locale, t } = useI18n()

const path = computed(() => `/guide/${route.params.category}/${route.params.slug}`)
const collection = computed(() => (locale.value === 'en' ? 'guide_en' : 'guide_zh') as 'guide_en' | 'guide_zh')

const { data: result } = await useAsyncData(() => `guide:${locale.value}:${path.value}`, async () => {
  const hit = await queryCollection(collection.value).path(path.value).first()
  if (hit) return { page: hit, fallback: false }
  const zh = await queryCollection('guide_zh').path(path.value).first()
  return zh ? { page: zh, fallback: locale.value !== 'zh-CN' } : null
}, { watch: [path, locale] })

const { data: index } = await useAsyncData(() => `guide-index:${locale.value}`, async () => {
  const zh = await queryCollection('guide_zh').select('path', 'title', 'description', 'order').all()
  if (locale.value === 'zh-CN') return sortGuideIndex(zh)
  const en = await queryCollection('guide_en').select('path', 'title', 'description', 'order').all()
  const byPath = new Map(en.map(e => [e.path, e]))
  return sortGuideIndex(zh.map(z => byPath.get(z.path) ?? z))
}, { watch: [locale] })

if (!result.value) throw createError({ statusCode: 404, statusMessage: 'Not found' })

useSeoMeta({
  title: () => `${result.value?.page.title ?? ''} · ${t('guide.title')}`,
  description: () => result.value?.page.description ?? '',
})
</script>

<template>
  <div class="page page--guide">
    <GuideShell
      :index="index ?? []"
      :current-path="path"
      :fallback="result?.fallback ?? false"
    >
      <template v-if="result">
        <h1>{{ result.page.title }}</h1>
        <p
          v-if="result.page.description"
          class="lead"
        >
          {{ result.page.description }}
        </p>
        <ContentRenderer
          :value="result.page"
          class="prose"
        />
      </template>
    </GuideShell>
  </div>
</template>
