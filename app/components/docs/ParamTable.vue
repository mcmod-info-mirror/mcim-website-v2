<script setup lang="ts">
import type { ReferenceParam } from '~~/shared/types/reference'

defineProps<{ params: ReferenceParam[] }>()
const { t } = useI18n()
</script>

<template>
  <div class="ref-table">
    <table>
      <thead>
        <tr>
          <th>{{ t('docs.col_name') }}</th>
          <th>{{ t('docs.col_in') }}</th>
          <th>{{ t('docs.col_type') }}</th>
          <th>{{ t('docs.col_required') }}</th>
          <th>{{ t('docs.col_desc') }}</th>
          <th>{{ t('docs.col_example') }}</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="param in params"
          :key="`${param.in}-${param.name}`"
        >
          <td><code>{{ param.name }}</code></td>
          <td class="muted">
            {{ t(`docs.in_${param.in}`) }}
          </td>
          <td class="muted">
            {{ param.type }}
          </td>
          <td>{{ param.required ? t('docs.yes') : t('docs.no') }}</td>
          <td>{{ param.description }}</td>
          <td><code v-if="param.example">{{ param.example }}</code></td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
