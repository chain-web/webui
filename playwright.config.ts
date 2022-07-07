// playwright.config.ts
import { type PlaywrightTestConfig, devices } from '@playwright/test';

const config: PlaywrightTestConfig = {
  use: {
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    // {
      // firefox只能使用TSL1.3，所以在升级star server 的nginx前不能使用
    //   name: 'firefox',
    //   use: { ...devices['Desktop Firefox'] },
    // },
    // {
      // 待排查，do not work
    //   name: 'webkit',
    //   use: { ...devices['Desktop Safari'] },
    // },
  ],
};
export default config;
