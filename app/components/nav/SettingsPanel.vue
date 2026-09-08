<script setup lang="ts">
import type { ThemePreference } from '~/composables/useTheme'

const { t, locale, setLocale } = useI18n()
const { preference, setPreference } = useTheme()
const open = useState('settings-open', () => false)

const themes = [
  { value: 'system', icon: 'material-symbols:brightness-auto-outline-rounded', key: 'settings.theme_system' },
  { value: 'light', icon: 'material-symbols:light-mode-outline-rounded', key: 'settings.theme_light' },
  { value: 'dark', icon: 'material-symbols:dark-mode-outline-rounded', key: 'settings.theme_dark' },
] as const

const languages = [
  { code: 'zh-CN', label: '中文' },
  { code: 'en', label: 'English' },
] as const

type Group = HTMLElement & { value: string }

function onTheme(e: Event) {
  const group = e.target as Group
  const value = group.value
  if (value === 'system' || value === 'light' || value === 'dark') setPreference(value as ThemePreference)
  else group.value = preference.value
}

function onLocale(e: Event) {
  const group = e.target as Group
  const value = group.value
  if (value === 'zh-CN' || value === 'en') setLocale(value)
  else group.value = locale.value
}
</script>

<template>
  <mdui-dialog
    :open="open || undefined"
    :headline="t('settings.title')"
    close-on-esc
    close-on-overlay-click
    @close="open = false"
  >
    <div class="settings-section">
      <div class="settings-label">
        <Icon name="material-symbols:palette-outline-rounded" />
        {{ t('settings.theme') }}
      </div>
      <mdui-segmented-button-group
        selects="single"
        required
        full-width
        :value="preference"
        @change="onTheme"
      >
        <mdui-segmented-button
          v-for="th in themes"
          :key="th.value"
          :value="th.value"
          @click="keepSelected"
        >
          <Icon
            slot="icon"
            :name="th.icon"
          />
          {{ t(th.key) }}
        </mdui-segmented-button>
      </mdui-segmented-button-group>
    </div>
    <div class="settings-section">
      <div class="settings-label">
        <Icon name="material-symbols:translate-rounded" />
        {{ t('settings.language') }}
      </div>
      <mdui-segmented-button-group
        selects="single"
        required
        full-width
        :value="locale"
        @change="onLocale"
      >
        <mdui-segmented-button
          v-for="lang in languages"
          :key="lang.code"
          :value="lang.code"
          @click="keepSelected"
        >
          {{ lang.label }}
        </mdui-segmented-button>
      </mdui-segmented-button-group>
    </div>
    <mdui-button
      slot="action"
      variant="text"
      @click="open = false"
    >
      {{ t('settings.close') }}
    </mdui-button>
  </mdui-dialog>
</template>
