<script setup lang="ts">
import type { ReferenceResponse } from '~~/shared/types/reference'

defineProps<{ responses: ReferenceResponse[] }>()
const { t } = useI18n()
</script>

<template>
  <div class="ref-table ref-table--narrow">
    <table>
      <thead>
        <tr>
          <th>{{ t('docs.col_code') }}</th>
          <th>{{ t('docs.col_desc') }}</th>
          <th>{{ t('docs.col_schema') }}</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="response in responses"
          :key="response.code"
        >
          <td><code :class="`code--${response.code.startsWith('2') ? 'ok' : 'bad'}`">{{ response.code }}</code></td>
          <td>{{ response.description }}</td>
          <td><code v-if="response.schema">{{ response.schema }}</code></td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
