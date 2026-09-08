<script setup lang="ts">
const config = useRuntimeConfig()

useHead({
  titleTemplate: t => (t ? `${t} · MCIM` : 'MCIM'),
  script: [{
    tagPosition: 'head',
    innerHTML: `(function(){try{var t=localStorage.getItem('mcim_theme');var c=t==='light'?'mdui-theme-light':t==='dark'?'mdui-theme-dark':'mdui-theme-auto';var h=document.documentElement;h.classList.remove('mdui-theme-auto','mdui-theme-light','mdui-theme-dark');h.classList.add(c)}catch(e){}})()`,
  }],
  meta: [
    { property: 'og:image', content: `${config.public.siteUrl}/brand/og.png` },
    { property: 'og:site_name', content: 'MCIM' },
  ],
})
</script>

<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>
