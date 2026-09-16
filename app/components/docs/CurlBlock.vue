<script setup lang="ts">
const props = defineProps<{ command: string }>()
const { t } = useI18n()

const copied = ref(false)
let timer: ReturnType<typeof setTimeout> | undefined

// 内网跑的是普通 http，非安全上下文里没有 navigator.clipboard，退回旧的选中复制
function write(text: string) {
  if (navigator.clipboard?.writeText) return navigator.clipboard.writeText(text)
  const area = document.createElement('textarea')
  area.value = text
  area.style.cssText = 'position:fixed;opacity:0'
  document.body.append(area)
  area.select()
  document.execCommand('copy')
  area.remove()
  return Promise.resolve()
}

async function copy() {
  await write(props.command)
  copied.value = true
  clearTimeout(timer)
  timer = setTimeout(() => (copied.value = false), 1500)
}

onUnmounted(() => clearTimeout(timer))
</script>

<template>
  <div class="curl">
    <pre><code>{{ command }}</code></pre>
    <mdui-button-icon
      class="curl__copy"
      :aria-label="copied ? t('docs.copied') : t('docs.copy')"
      @click="copy"
    >
      <Icon :name="copied ? 'material-symbols:check-rounded' : 'material-symbols:content-copy-outline-rounded'" />
    </mdui-button-icon>
  </div>
</template>
