import { test, expect } from '@playwright/test';
import { sleep } from './util';

test('basic test', async ({ page }) => {
  await page.goto(
    'http://localhost:8088/skchain#/test?autoStart=-1&forceReady=true',
  );
  const startBtn = page.locator(
    '#root > div > div.home-start-node > div:nth-child(1) > button',
  );
  await startBtn.click();

  await sleep(5 * 1000);

  const conssensusStatus = page.locator(
    '#root > div > div.home-start-node > div.home-node-status > div:nth-child(3) > div:nth-child(4) > span:nth-child(2)',
  );
  await expect(conssensusStatus).toHaveText('ready');
});
