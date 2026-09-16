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
  for (const path of ['/status', '/docs', '/lookup?platform=modrinth&id=sodium']) {
    await page.goto(path)
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth)
    expect(overflow, path).toBe(false)
  }
})

test('api reference renders every group without js', async ({ browser }) => {
  const ctx = await browser.newContext({ javaScriptEnabled: false })
  const page = await ctx.newPage()
  await page.goto('/docs')
  await expect(page.locator('.ref-group')).toHaveCount(6)
  const operation = page.locator('details.op', { hasText: '/modrinth/v2/search' })
  await expect(operation.locator('.op__method')).toHaveText('GET')
  await expect(operation.locator('.curl pre')).toContainText('curl \'https://mod.mcimirror.top/modrinth/v2/search?query=sodium')
})

test('freshness panel renders full-width bars without js', async ({ browser }) => {
  const ctx = await browser.newContext({ javaScriptEnabled: false })
  const page = await ctx.newPage()
  await page.goto('/status')
  const rows = page.locator('.freshness-row')
  await expect(rows).toHaveCount(2)
  for (let i = 0; i < 2; i++) {
    const widths = await rows.nth(i).locator('.freshness-bar__band').evaluateAll(
      bands => bands.map(band => Number.parseFloat((band as HTMLElement).style.width)),
    )
    expect(widths.length).toBeGreaterThan(0)
    expect(widths.reduce((sum, width) => sum + width, 0)).toBeCloseTo(100, 0)
  }
})

test('lookup answers a slug without js', async ({ browser }) => {
  const ctx = await browser.newContext({ javaScriptEnabled: false })
  const page = await ctx.newPage()
  await page.goto('/lookup')
  await page.locator('input[name="id"]').fill('sodium')
  await page.locator('button[type="submit"]').click()
  await expect(page).toHaveURL(/id=sodium/)
  const card = page.locator('.lookup-card')
  await expect(card.locator('h2')).toHaveText('Sodium')
  await expect(card.locator('.lookup-facts dd time')).toHaveCount(3)
})

test('lookup rejects a mistyped id before calling upstream', async ({ page }) => {
  await page.goto('/lookup?platform=curseforge&id=jei')
  await expect(page.locator('.banner')).toContainText(/格式不对|looks wrong/)
  await expect(page.locator('.lookup-card')).toHaveCount(0)
})
