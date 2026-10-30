import { defineConfig } from '@playwright/test';
export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: false,
  use: { baseURL: process.env.PORTO_BASE_URL || 'http://127.0.0.1:4173', browserName: 'chromium', channel: 'msedge', screenshot: 'only-on-failure' },
  webServer: process.env.PORTO_BASE_URL ? undefined : { command: 'npm run dev -- --port 4173', url: 'http://127.0.0.1:4173', reuseExistingServer: !process.env.CI },
});
