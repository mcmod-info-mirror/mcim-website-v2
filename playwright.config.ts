import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  testDir: 'tests/e2e',
  use: { baseURL: 'http://localhost:3000' },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'mobile', use: { ...devices['Desktop Chrome'], viewport: { width: 375, height: 720 } } },
  ],
  webServer: [
    { command: 'node dev/mock/server.mjs', port: 9901, reuseExistingServer: true },
    { command: 'npm run dev', port: 3000, reuseExistingServer: true, env: { NUXT_SYNC_API_BASE: 'http://127.0.0.1:9901' }, timeout: 120000 },
  ],
})
