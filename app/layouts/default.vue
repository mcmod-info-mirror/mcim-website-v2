<script setup lang="ts">
import type { BuildInfo } from '~~/shared/types/api'

const { t, locale } = useI18n()
const config = useRuntimeConfig()
const { data: build } = useFetch<BuildInfo>('/api/build', { lazy: true, server: false })

useHead({ htmlAttrs: { lang: computed(() => (locale.value === 'en' ? 'en' : 'zh-CN')) } })
</script>

<template>
  <div class="app">
    <a
      href="#main"
      class="skip-link"
    >{{ t('nav.skip') }}</a>
    <NavSideRail />
    <img
      class="watermark"
      src="/brand/logo-mark.webp"
      alt=""
      aria-hidden="true"
      width="1024"
      height="1024"
    >
    <div class="main">
      <main
        id="main"
        class="main__content"
        tabindex="-1"
      >
        <slot />
      </main>
      <footer class="footer">
        <span>{{ t('footer.site') }} {{ config.public.siteCommit }}</span>
        <span>{{ t('footer.api') }} {{ build ? `${build.version} ${build.commit}` : t('footer.build_unknown') }}</span>
        <span><a
          href="https://github.com/mcmod-info-mirror"
          rel="noopener"
        >GitHub</a></span>
        <span><a
          href="https://beian.miit.gov.cn"
          rel="noopener"
        >{{ t('footer.icp') }}</a></span>
      </footer>
    </div>
  </div>
</template>
