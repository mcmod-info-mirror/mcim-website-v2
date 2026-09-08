import { execSync } from 'node:child_process'

function gitCommit() {
  try {
    return execSync('git rev-parse --short HEAD', { stdio: ['ignore', 'pipe', 'ignore'] }).toString().trim()
  }
  catch {
    return ''
  }
}

const commit = process.env.NUXT_PUBLIC_SITE_COMMIT?.slice(0, 7) || gitCommit() || 'dev'

export default defineNuxtConfig({
  modules: ['@nuxt/eslint', '@nuxt/icon', '@nuxtjs/i18n', '@nuxt/content'],
  devtools: { enabled: false },
  app: {
    head: {
      htmlAttrs: { lang: 'zh-CN', class: 'mdui-theme-auto' },
      meta: [
        { name: 'viewport', content: 'width=device-width, initial-scale=1, viewport-fit=cover' },
      ],
      link: [
        { rel: 'icon', href: '/brand/favicon.ico', sizes: 'any' },
        { rel: 'icon', type: 'image/png', sizes: '32x32', href: '/brand/favicon-32.png' },
        { rel: 'apple-touch-icon', href: '/brand/apple-touch-icon.png' },
      ],
    },
  },
  css: ['mdui/mdui.css', '~/assets/css/main.scss'],
  vue: {
    compilerOptions: {
      isCustomElement: tag => tag === 'stripe-buy-button' || tag.startsWith('mdui-'),
    },
  },
  content: {
    experimental: { sqliteConnector: 'native' },
  },
  runtimeConfig: {
    mcimApiBase: 'https://mod.mcimirror.top',
    syncApiBase: '',
    upstreamUserAgent: `mcim-website/${commit} (+https://github.com/mcmod-info-mirror/mcim-website-v2)`,
    upstreamTimeoutMs: 5000,
    public: {
      siteUrl: 'https://www.mcimirror.top',
      apiUrl: 'https://mod.mcimirror.top',
      siteCommit: commit,
      stripeBuyButtonId: 'buy_btn_1S07F8JdozoqG8Z5GyxlY8SW',
      stripePublishableKey: 'pk_live_51RIdSjJdozoqG8Z5Tj0EPeqWDpxNwf1bRgIsNccaTJ1c0YhB9N7ek7WdnWTM13aa7M4lrffzIpmQf0Z8uEdp28vA00LN7uByKl',
    },
  },
  routeRules: {
    '/guide': { redirect: '/guide/start/getting-started' },
  },
  compatibilityDate: '2026-09-08',
  eslint: {
    config: {
      stylistic: { indent: 2, quotes: 'single', semi: false },
    },
  },
  i18n: {
    strategy: 'no_prefix',
    defaultLocale: 'zh-CN',
    locales: [
      { code: 'zh-CN', language: 'zh-CN', name: '中文', file: 'zh-CN.json' },
      { code: 'en', language: 'en-US', name: 'English', file: 'en.json' },
    ],
    detectBrowserLanguage: {
      useCookie: true,
      cookieKey: 'mcim_locale',
      alwaysRedirect: false,
      fallbackLocale: 'zh-CN',
    },
  },
  icon: {
    serverBundle: { collections: ['material-symbols'] },
    clientBundle: { scan: true },
  },
})
