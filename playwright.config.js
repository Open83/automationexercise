import 'dotenv/config';
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  timeout: 60000,
   globalSetup: './tests/global-setup.js', 
  fullyParallel: true,
  retries: 1,
  reporter: [['html', { open: 'never' }], ['list']],
  use: {
    baseURL: 'https://automationexercise.com',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});
