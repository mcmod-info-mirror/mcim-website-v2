import { readFileSync } from 'node:fs'
import { expect, test } from '@playwright/test'

const scheduled = JSON.parse(readFileSync(new URL('../fixtures/sync/tasks.json', import.meta.url), 'utf8')) as { data: { task: string }[] }

test('home renders stats without js', async ({ browser }) => {
  const ctx = await browser.newContext({ javaScriptEnabled: false })
  const page = await ctx.newPage()
  await page.goto('/')
  await expect(page.locator('h1')).toContainText('MCIM')
  await expect(page.locator('.stats')).toContainText(/\d{1,3}(,\d{3})+/)
})

test('status lists every scheduled task', async ({ page }) => {
  await page.goto('/status')
  await expect(page.locator('a.task-row')).toHaveCount(scheduled.data.length)
  await expect(page.locator('a.task-row', { hasText: 'modrinth-queue' })).toContainText(/成功|Success/)
})

test('theme persists across reload', async ({ page }) => {
  await page.goto('/', { waitUntil: 'networkidle' })
  await page.locator('mdui-button-icon[aria-label]:visible').first().click()
  await page.locator('mdui-segmented-button[value="dark"]').click()
  await expect(page.locator('html')).toHaveClass(/mdui-theme-dark/)
  await page.reload()
  await expect(page.locator('html')).toHaveClass(/mdui-theme-dark/)
})

test('mobile has no horizontal scroll', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 720 })
  await page.goto('/status')
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth)
  expect(overflow).toBe(false)
})
