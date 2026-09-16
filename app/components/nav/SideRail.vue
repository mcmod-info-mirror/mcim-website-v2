<script setup lang="ts">
const { t } = useI18n()
const route = useRoute()
const router = useRouter()
const settingsOpen = useState('settings-open', () => false)

const items = [
  { to: '/', icon: 'material-symbols:home-rounded', key: 'nav.home', exact: true },
  { to: '/status', icon: 'material-symbols:monitor-heart-outline-rounded', key: 'nav.status' },
  { to: '/docs', icon: 'material-symbols:api-rounded', key: 'nav.docs' },
  { to: '/lookup', icon: 'material-symbols:search-rounded', key: 'nav.lookup' },
  { to: '/guide', icon: 'material-symbols:menu-book-outline-rounded', key: 'nav.guide' },
  { to: '/sponsor', icon: 'material-symbols:favorite-outline-rounded', key: 'nav.sponsor' },
]

const current = computed(() => items.find(i => (i.exact ? route.path === '/' : route.path.startsWith(i.to)))?.to ?? '')
</script>

<template>
  <mdui-navigation-rail
    :value="current"
    alignment="start"
  >
    <NuxtLink
      slot="top"
      to="/"
      class="rail-brand"
      aria-label="MCIM"
    >
      <img
        src="/brand/logo-mark-192.png"
        alt=""
        width="76"
        height="76"
      >
    </NuxtLink>
    <mdui-navigation-rail-item
      v-for="item in items"
      :key="item.to"
      :value="item.to"
      :href="item.to"
      :aria-current="current === item.to ? 'page' : undefined"
      @click="pushOnClick($event, item.to, router)"
    >
      <Icon
        slot="icon"
        :name="item.icon"
      />
      {{ t(item.key) }}
    </mdui-navigation-rail-item>
    <mdui-button-icon
      slot="bottom"
      class="rail-settings"
      :aria-label="t('nav.settings')"
      @click="settingsOpen = true"
    >
      <Icon name="material-symbols:settings-outline-rounded" />
    </mdui-button-icon>
  </mdui-navigation-rail>

  <mdui-top-app-bar
    class="mobile-bar"
    scroll-behavior="elevate"
  >
    <NuxtLink
      to="/"
      class="rail-brand"
      aria-label="MCIM"
    >
      <img
        src="/brand/logo-mark-192.png"
        alt=""
        width="40"
        height="40"
      >
    </NuxtLink>
    <mdui-top-app-bar-title>MCIM</mdui-top-app-bar-title>
    <mdui-button-icon
      class="mobile-settings"
      :aria-label="t('nav.settings')"
      @click="settingsOpen = true"
    >
      <Icon name="material-symbols:settings-outline-rounded" />
    </mdui-button-icon>
  </mdui-top-app-bar>

  <mdui-navigation-bar
    class="mobile-nav"
    :value="current"
    label-visibility="labeled"
  >
    <mdui-navigation-bar-item
      v-for="item in items"
      :key="item.to"
      :value="item.to"
      :href="item.to"
      @click="pushOnClick($event, item.to, router)"
    >
      <Icon
        slot="icon"
        :name="item.icon"
      />
      {{ t(item.key) }}
    </mdui-navigation-bar-item>
  </mdui-navigation-bar>

  <NavSettingsPanel />
</template>
