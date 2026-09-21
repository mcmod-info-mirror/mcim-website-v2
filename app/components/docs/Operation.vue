<script setup lang="ts">
import type { ReferenceOperation } from '~~/shared/types/reference'
import { buildCurl } from '~~/shared/utils/curl'

const props = defineProps<{ operation: ReferenceOperation, baseUrl: string, swaggerUrl: string }>()
const { t } = useI18n()

// 初值就是规范里的示例，所以服务端渲染出来的命令与改动前一致，无 JS 时照样能看到一条完整的 curl
const values = reactive(props.operation.params.map(param => param.example ?? ''))
const body = ref(props.operation.body_example ?? '')

const filled = computed(() => props.operation.params.map((param, index) => ({ ...param, example: values[index] || null })))
const curl = computed(() => buildCurl(props.baseUrl, props.operation.method, props.operation.path, filled.value, body.value))

// Swagger UI 的深链走原始 tag，所以这里不能用归位后的分组名
const swaggerLink = computed(() => `${props.swaggerUrl}#/${encodeURIComponent(props.operation.tag)}/${props.operation.id}`)
</script>

<template>
  <details
    :id="operation.id"
    class="op"
  >
    <summary class="op__head">
      <Icon
        class="op__chevron"
        name="material-symbols:chevron-right-rounded"
      />
      <span
        class="op__method"
        :class="`op__method--${operation.method.toLowerCase()}`"
      >{{ operation.method }}</span>
      <code class="op__path">{{ operation.path }}</code>
      <span class="op__summary">
        <span
          v-if="operation.deprecated"
          class="pill pill--failed"
        >{{ t('docs.deprecated') }}</span>
        {{ operation.summary }}
      </span>
    </summary>

    <div class="op__body">
      <h3>{{ t('docs.params') }}</h3>
      <DocsParamTable
        v-if="operation.params.length"
        :params="operation.params"
        :values="values"
        @update="(index, value) => values[index] = value"
      />
      <p
        v-else
        class="muted"
      >
        {{ t('docs.no_params') }}
      </p>

      <template v-if="operation.body">
        <h3>{{ t('docs.body') }}</h3>
        <p><code>{{ operation.body }}</code></p>
        <textarea
          v-model="body"
          class="op__body-input"
          rows="3"
          spellcheck="false"
          :aria-label="t('docs.body')"
        />
      </template>

      <h3>{{ t('docs.responses') }}</h3>
      <DocsResponseTable :responses="operation.responses" />

      <h3>{{ t('docs.example_request') }}</h3>
      <p class="op__hint faint">
        {{ t('docs.curl_hint') }}
      </p>
      <DocsCurlBlock :command="curl" />

      <p class="op__swagger">
        <a
          :href="swaggerLink"
          target="_blank"
          rel="noopener"
        >{{ t('docs.view_in_swagger') }}</a>
      </p>
    </div>
  </details>
</template>
