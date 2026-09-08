import { defineCollection, defineContentConfig, z } from '@nuxt/content'

const schema = z.object({
  title: z.string(),
  description: z.string(),
  order: z.number(),
})

export default defineContentConfig({
  collections: {
    guide_zh: defineCollection({ type: 'page', source: { include: 'guide/zh-CN/**/*.md', prefix: '/guide' }, schema }),
    guide_en: defineCollection({ type: 'page', source: { include: 'guide/en/**/*.md', prefix: '/guide' }, schema }),
  },
})
