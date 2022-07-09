import { test, expect, Page } from '@playwright/test';
import { accounts } from './accounts';
import { sleep } from './util';

const login = async (page: Page) => {
  await page.goto(
    'http://localhost:8088/skchain#/test?autoStart=-1&forceReady=true',
  );
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
};

test('basic test: start', async ({ page }) => {
  await login(page);

  const conssensusStatus = page.locator(
    '#root > div > div.home-start-node > div.home-node-status > div:nth-child(3) > div:nth-child(4) > span:nth-child(2)',
  );
  await expect(conssensusStatus).toHaveText('ready');
});

test('basic test: transaction', async ({ page }) => {
  await login(page);
  const blockNumber = page.locator(
    '#root > div > div.home-start-node > div > div:nth-child(3) > div:nth-child(6) > span:nth-child(2)',
  );
  const noice = page.locator(
    '#root > div > div.home-start-node > div > div:nth-child(3) > div:nth-child(9) > span:nth-child(2)',
  );
  await expect(blockNumber).toHaveText('0');
  await expect(noice).toHaveText('1');

  await page.fill('.trans-trans-to-ipt', accounts[1].id);
  await page.fill('#trans_amount', '1');

  await page.click('#root > div > div.trans-box > form > button');

  await sleep(10 * 1000);

  await expect(blockNumber).toHaveText('1');
  await expect(noice).toHaveText('2');
});
