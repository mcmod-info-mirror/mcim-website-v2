<script setup lang="ts">
const props = defineProps<{
  index: { path: string, title: string }[]
  currentPath: string
  fallback: boolean
}>()

const { t } = useI18n()
const router = useRouter()

const groups = computed(() => GUIDE_CATEGORIES
  .map(key => ({ key, label: t(`guide.category_${key}`), items: props.index.filter(i => guideCategory(i.path) === key) }))
  .filter(g => g.items.length > 0))

const activeTab = ref(guideCategory(props.currentPath))
watch(() => props.currentPath, (p) => {
  activeTab.value = guideCategory(p)
})

const visible = computed(() => groups.value.find(g => g.key === activeTab.value)?.items ?? [])

function onTab(e: Event) {
  const group = e.target as HTMLElement & { value: string }
  if (group.value) activeTab.value = group.value
  else group.value = activeTab.value
}
</script>

<template>
  <div class="guide">
    <mdui-segmented-button-group
      class="guide__tabs"
      selects="single"
      required
      :value="activeTab"
      @change="onTab"
    >
      <mdui-segmented-button
        v-for="g in groups"
        :key="g.key"
        :value="g.key"
        @click="keepSelected"
      >
        {{ g.label }}
      </mdui-segmented-button>
    </mdui-segmented-button-group>
    <div class="guide__cols">
      <nav
        class="guide__list"
        :aria-label="t('guide.title')"
      >
        <mdui-list>
          <mdui-list-item
            v-for="item in visible"
            :key="item.path"
            class="guide__item"
            :href="item.path"
            :active="item.path === currentPath || undefined"
            :aria-current="item.path === currentPath ? 'page' : undefined"
            rounded
            @click="pushOnClick($event, item.path, router)"
          >
            <Icon
              slot="icon"
              name="material-symbols:article-outline-rounded"
            />
            {{ item.title }}
            <Icon
              slot="end-icon"
              name="material-symbols:chevron-right-rounded"
            />
          </mdui-list-item>
        </mdui-list>
      </nav>
      <article class="guide__body">
        <p
          v-if="fallback"
          class="banner"
        >
          {{ t('guide.fallback_zh') }}
        </p>
        <slot />
      </article>
    </div>
  </div>
</template>
