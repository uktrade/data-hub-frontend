import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  const [response] = await Promise.all([
    page.waitForResponse(resp => resp.url().includes('/api-proxy/v4/metadata/service')),
    page.waitForResponse(resp => resp.url().includes('/api-proxy/v4/metadata/sector')),
    page.waitForResponse(resp => resp.url().includes('/api-proxy/v4/metadata/policy-area')),
    page.waitForResponse(resp => resp.url().includes('/api-proxy/v4/metadata/policy-issue-type')),
    page.waitForResponse(resp => resp.url().includes('/api-proxy/v4/metadata/one-list-tier')),
    page.waitForResponse(resp => resp.url().includes('/api-proxy/v4/reminder/summary')),
    page.waitForResponse(resp => resp.url().includes('/api-proxy/v3/search/interaction')),
    page.goto('/interactions?sortby=date:desc&page=1'),
  ])
  await expect(page).toHaveTitle(/Interactions - DBT Data Hub/)
});

test.describe('interactions', () => {
  test('list', async ({ browser, page }) => {  
    await expect(page.getByRole('heading', {name: 'interactions', level: 2})).toContainText('interactions')
  });
  
  test('view an interaction', async ({ browser, page }) => {
    // await page.locator('[data-test="primary-navigation"]').getByRole('link', { name: 'Interactions' }).click();
    const [response] = await Promise.all([
      page.waitForResponse(resp => resp.url().includes('/api-proxy/v4/interaction/')  && resp.status() === 200),
      // Click on the title of the first interaction in list.
      await page.locator('li[data-test="collection-item"] h3 a').first().click(),
    ])
    await expect(page).toHaveTitle(/- Interactions - DBT Data Hub/)
  });
});