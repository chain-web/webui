import { test, expect } from '@playwright/test';
import { sleep } from './util';

test.describe.configure({ mode: 'parallel' });
test.setTimeout(10 * 60 * 1000);

for (let index = 1; index <= 4; index++) {
  test(`pree test ${index}`, async ({ page }) => {
    await page.goto(
      'http://localhost:8088/skchain#/test?autoStart=-1&forceReady=true',
    );
    const startBtn = page.locator(
      `#root > div > div.home-start-node > div:nth-child(${index}) > button`,
    );
    await startBtn.click();

    await sleep(35 * 1000);

    const slicePeerCount = page.locator(
      '#root > div > div.home-start-node > div.home-node-status > div:nth-child(3) > div:nth-child(5) > span:nth-child(2)',
    );
    await expect(slicePeerCount).toHaveText('4');
  });
}
