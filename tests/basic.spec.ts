import { test, expect } from '@playwright/test';
import { accounts } from './accounts';
import { sleep } from './util';

test('basic test', async ({ page }) => {
  await page.goto(
    'http://localhost:8088/skchain#/test?autoStart=-1&forceReady=true',
  );

  // login
  await page.fill(
    '#root > div > div.home-start-node > div:nth-child(1) > div > div:nth-child(3) > div > div:nth-child(1) > input[type=text]',
    accounts[0].id,
  );
  await page.fill(
    '#root > div > div.home-start-node > div:nth-child(1) > div > div:nth-child(3) > div > div:nth-child(2) > input[type=text]',
    accounts[0].privKey,
  );
  await page.click('#login-login-btn');

  // wait for login
  await sleep(5 * 1000);

  const conssensusStatus = page.locator(
    '#root > div > div.home-start-node > div.home-node-status > div:nth-child(3) > div:nth-child(4) > span:nth-child(2)',
  );
  await expect(conssensusStatus).toHaveText('ready');
});
