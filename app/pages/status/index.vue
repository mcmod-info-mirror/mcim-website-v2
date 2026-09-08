<script setup lang="ts">
const { t } = useI18n()
const { tasks, unavailable } = useTaskStatus()

useSeoMeta({ title: t('status.title'), description: t('status.intro') })

const groups = computed(() => {
  const order = ['curseforge', 'modrinth', 'other'] as const
  return order
    .map(key => ({ key, label: t(`status.group_${key}`), items: tasks.value.filter(x => (x.provider === 'curseforge' || x.provider === 'modrinth' ? x.provider : 'other') === key) }))
    .filter(g => g.items.length > 0)
})
</script>

<template>
  <div class="page page--wide">
    <h1>{{ t('status.title') }}</h1>
    <p class="lead">
      {{ t('status.intro') }}
    </p>

    <div
      v-if="unavailable"
      class="banner"
      role="status"
    >
      {{ t('status.unavailable') }}
    </div>

    <StatusTaskSummaryBar
      v-if="tasks.length"
      :tasks="tasks"
    />

    <section
      v-for="group in groups"
      :key="group.key"
      class="task-group"
    >
      <h2 class="task-group__title">
        {{ group.label }}
      </h2>
      <div
        class="task-row task-row--head"
        aria-hidden="true"
      >
        <span>{{ t('status.col_task') }}</span>
        <span>{{ t('status.col_status') }}</span>
        <span>{{ t('status.col_last_success') }}</span>
        <span>{{ t('status.col_next_run') }}</span>
        <span>{{ t('status.col_summary') }}</span>
        <span>{{ t('status.col_duration') }}</span>
      </div>
      <StatusTaskRow
        v-for="item in group.items"
        :key="item.task"
        :item="item"
      />
    </section>
  </div>
</template>
