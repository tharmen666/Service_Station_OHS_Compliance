import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: 1,
  reporter: [['html', { open: 'never' }], ['list']],
  use: {
    baseURL: 'http://localhost:5188',
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'Mobile Chrome',
      use: { ...devices['Pixel 5'] },
    },
  ],
  webServer: {
    command: process.platform === 'win32'
      ? 'cmd.exe /c npm run build && cmd.exe /c npx vite preview --port 5188 --host'
      : 'npm run build && npx vite preview --port 5188 --host',
    url: 'http://localhost:5188',
    reuseExistingServer: !process.env.CI,
    timeout: 120000,
  },
});
