<script setup lang="ts">
defineProps<{ icon: string, title: string, id?: string }>()
</script>

<template>
  <section
    :id="id"
    class="home-section"
  >
    <h2 class="home-section__title">
      <Icon :name="icon" />
      <span>{{ title }}</span>
    </h2>
    <slot />
  </section>
</template>

<style scoped>
.home-section {
  margin: 0 0 28px;
}

.home-section__title {
  display: flex;
  align-items: center;
  gap: 8px;
}

.home-section__title .iconify {
  font-size: 20px;
  color: var(--accent);
}
</style>
