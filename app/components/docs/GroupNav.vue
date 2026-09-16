<script setup lang="ts">
import type { ReferenceGroup } from '~~/shared/types/reference'

defineProps<{ groups: ReferenceGroup[] }>()
const { t } = useI18n()
</script>

<template>
  <nav
    class="ref-nav"
    :aria-label="t('docs.index')"
  >
    <ol class="ref-nav__list">
      <li
        v-for="group in groups"
        :key="group.id"
      >
        <a :href="`#${group.id}`">
          {{ group.name }}
          <span
            class="faint"
            :title="t('docs.op_count', { n: group.operations.length })"
          >{{ group.operations.length }}</span>
        </a>
      </li>
    </ol>
  </nav>
</template>
