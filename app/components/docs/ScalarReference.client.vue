<script setup lang="ts">
import { ApiReference } from '@scalar/api-reference'
import '@scalar/api-reference/style.css'

const props = defineProps<{ dark: boolean, attempt: number, apiUrl: string }>()
const emit = defineEmits<{ error: [] }>()

const configuration = computed(() => ({
  url: `/api/openapi?v=${props.attempt}`,
  theme: 'purple' as const,
  darkMode: props.dark,
  forceDarkModeState: props.dark ? 'dark' as const : 'light' as const,
  hideDarkModeToggle: true,
  hideClientButton: true,
  servers: [{ url: props.apiUrl }],
}))

onErrorCaptured(() => {
  emit('error')
  return false
})
</script>

<template>
  <ApiReference :configuration="configuration" />
</template>
