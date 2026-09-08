<script setup lang="ts">
import type { TaskRun } from '~~/shared/types/sync'

const props = defineProps<{ run: TaskRun | null, large?: boolean }>()
const { t } = useI18n()
const s = computed(() => displayStatus(props.run))
</script>

<template>
  <span
    class="badge"
    :class="{ 'badge--large': large }"
  >
    <span
      class="dot"
      :class="`dot--${s.token}`"
      aria-hidden="true"
    />
    <span class="badge__text">{{ t(`state.${s.key}`) }}</span>
    <UiRelativeTime
      v-if="s.at"
      :iso="s.at"
      class="faint"
    />
  </span>
</template>
