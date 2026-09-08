<script setup lang="ts">
const { t } = useI18n()
const config = useRuntimeConfig()
const router = useRouter()

useSeoMeta({
  title: t('home.title'),
  description: t('home.tagline'),
  ogTitle: `MCIM · ${t('home.title')}`,
  ogDescription: t('home.tagline'),
})

const replacements = [
  {
    name: 'Modrinth',
    rows: [
      ['api.modrinth.com', 'mod.mcimirror.top/modrinth'],
      ['cdn.modrinth.com', 'mod.mcimirror.top'],
    ],
  },
  {
    name: 'CurseForge',
    rows: [
      ['api.curseforge.com', 'mod.mcimirror.top/curseforge'],
      ['edge.forgecdn.net', 'mod.mcimirror.top'],
    ],
  },
]

const entries = [
  { to: '/status', icon: 'material-symbols:monitor-heart-outline-rounded', title: 'home.how_status', desc: 'home.how_status_desc' },
  { to: '/docs', icon: 'material-symbols:api-rounded', title: 'home.how_docs', desc: 'home.how_docs_desc' },
  { to: '/guide', icon: 'material-symbols:menu-book-outline-rounded', title: 'home.how_guide', desc: 'home.how_guide_desc' },
]

const people = [
  { name: 'z0z0r4', href: 'https://github.com/z0z0r4', desc: '' },
  { name: 'Pysio', href: 'https://github.com/pysio2007', desc: 'home.people_pysio' },
  { name: 'BangBang93', href: 'https://blog.bangbang93.com/', desc: 'home.people_bangbang93' },
  { name: 'SaltWood', href: 'https://github.com/SALTWOOD', desc: 'home.people_saltwood' },
]
</script>

<template>
  <div class="page home">
    <header class="home__hero">
      <h1 class="visually-hidden">
        MCIM
      </h1>
      <img
        class="home__banner"
        src="/brand/banner.webp"
        alt="The MCIM Project"
        width="1600"
        height="640"
        fetchpriority="high"
      >
      <p class="lead">
        {{ t('home.tagline') }}
      </p>
    </header>

    <HomeSection
      icon="material-symbols:bar-chart-rounded"
      :title="t('home.stats_title')"
    >
      <HomeStatsPanel />
    </HomeSection>

    <HomeSection
      icon="material-symbols:swap-horiz-rounded"
      :title="t('home.replace_title')"
    >
      <div
        v-for="group in replacements"
        :key="group.name"
        class="replace"
      >
        <h3>{{ group.name }}</h3>
        <ul class="replace__rows">
          <li
            v-for="[from, to] in group.rows"
            :key="from"
            class="replace__row"
          >
            <code>{{ from }}</code>
            <Icon
              name="material-symbols:arrow-right-alt-rounded"
              class="replace__arrow"
              aria-hidden="true"
            />
            <code class="code--mirror">{{ to }}</code>
          </li>
        </ul>
      </div>
      <p>
        <NuxtLink to="/guide/start/getting-started">
          {{ t('home.replace_more') }}
        </NuxtLink>
      </p>
    </HomeSection>

    <HomeSection
      icon="material-symbols:rocket-launch-outline-rounded"
      :title="t('home.how_title')"
    >
      <div class="entries">
        <mdui-card
          v-for="entry in entries"
          :key="entry.to"
          variant="outlined"
          clickable
          :href="entry.to"
          class="entry"
          @click="pushOnClick($event, entry.to, router)"
        >
          <div class="card-body entry__body">
            <Icon :name="entry.icon" />
            <strong>{{ t(entry.title) }}</strong>
            <span class="muted">{{ t(entry.desc) }}</span>
          </div>
        </mdui-card>
      </div>
    </HomeSection>

    <HomeSection
      icon="material-symbols:group-outline-rounded"
      :title="t('home.people_title')"
    >
      <ul class="people">
        <li
          v-for="person in people"
          :key="person.name"
        >
          <a
            :href="person.href"
            rel="noopener"
          >{{ person.name }}</a>
          <span
            v-if="person.desc"
            class="muted"
          > · {{ t(person.desc) }}</span>
        </li>
        <li class="muted">
          {{ t('home.people_nodes') }}
        </li>
      </ul>
    </HomeSection>

    <HomeSection
      icon="material-symbols:forum-outline-rounded"
      :title="t('home.project_title')"
    >
      <ul class="links">
        <li>
          <span class="muted">{{ t('home.project_github') }}</span>
          <a
            href="https://github.com/mcmod-info-mirror"
            rel="noopener"
          >github.com/mcmod-info-mirror</a>
        </li>
        <li>
          <span class="muted">{{ t('home.project_email') }}</span>
          <a href="mailto:z0z0r4@outlook.com">z0z0r4@outlook.com</a>
        </li>
        <li>
          <span class="muted">{{ t('home.project_status') }}</span>
          <a
            href="https://status.mcimirror.top"
            rel="noopener"
          >status.mcimirror.top</a>
        </li>
      </ul>
    </HomeSection>

    <HomeSection
      icon="material-symbols:warning-outline-rounded"
      :title="t('home.notice_title')"
    >
      <ol class="notices">
        <li>{{ t('home.notice_1') }}</li>
        <li>{{ t('home.notice_2') }}</li>
        <li>{{ t('home.notice_3') }}</li>
      </ol>
      <p>
        <NuxtLink to="/guide/rules/policy">
          {{ t('home.notice_more') }}
        </NuxtLink>
        · <a
          :href="config.public.apiUrl"
          rel="noopener"
        >{{ config.public.apiUrl }}</a>
      </p>
    </HomeSection>
  </div>
</template>

<style scoped>
.home__hero {
  margin: 0 0 24px;
}

.home__banner {
  display: block;
  width: 100%;
  height: auto;
  border-radius: var(--radius-lg);
  margin: 0 0 14px;
}

.mdui-theme-dark .home__banner {
  filter: brightness(.9);
}

@media (prefers-color-scheme: dark) {
  .mdui-theme-auto .home__banner {
    filter: brightness(.9);
  }
}

.replace {
  margin: 0 0 12px;
}

.replace__rows {
  list-style: none;
  padding: 0;
  margin: 0 0 4px;
  font-size: 14px;
}

.replace__row {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 4px 8px;
  margin: 0 0 6px;
}

.replace__arrow {
  font-size: 18px;
  color: var(--text-muted);
}

.entries {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 10px;
}

.entry {
  display: block;
}

.entry__body {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.entry .iconify {
  font-size: 22px;
  color: var(--accent);
}

.people,
.links,
.notices {
  padding-left: 20px;
}

.links li,
.people li {
  margin: 0 0 4px;
}

.links .muted {
  display: inline-block;
  min-width: 96px;
}
</style>
