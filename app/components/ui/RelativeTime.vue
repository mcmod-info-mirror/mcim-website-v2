<script setup lang="ts">
const props = defineProps<{ iso: string | null }>()
const now = useRelativeTime()
const { locale } = useI18n()
const relative = computed(() => formatRelative(props.iso, now.value, locale.value))
const absolute = computed(() => formatDateTime(props.iso, locale.value))
</script>

<template>
  <time
    :datetime="iso ?? undefined"
    :title="absolute"
  >{{ relative }}</time>
</template>
