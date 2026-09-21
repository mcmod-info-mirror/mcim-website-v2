<script setup lang="ts">
import type { ReferenceParam } from '~~/shared/types/reference'

defineProps<{ params: ReferenceParam[], values: string[] }>()
const emit = defineEmits<{ update: [index: number, value: string] }>()
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
          <th>{{ t('docs.col_value') }}</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="(param, index) in params"
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
          <td class="ref-table__desc">
            {{ param.description }}
          </td>
          <td>
            <input
              class="param-value"
              type="text"
              autocomplete="off"
              spellcheck="false"
              :value="values[index] ?? ''"
              :placeholder="param.example ?? param.name"
              :aria-label="param.name"
              @input="emit('update', index, ($event.target as HTMLInputElement).value)"
            >
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
