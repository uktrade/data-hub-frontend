import { test, expect } from '@playwright/test';

test('Interactions', async ({ browser, page }) => {
  const [response] = await Promise.all([
    page.waitForResponse(resp => resp.url().includes('/api-proxy/v4/metadata/service') && resp.status() === 200),
    page.waitForResponse(resp => resp.url().includes('/api-proxy/v4/metadata/sector') && resp.status() === 200),
    page.waitForResponse(resp => resp.url().includes('/api-proxy/v4/metadata/policy-area')  && resp.status() === 200),
    page.waitForResponse(resp => resp.url().includes('/api-proxy/v4/metadata/policy-issue-type')  && resp.status() === 200),
    page.waitForResponse(resp => resp.url().includes('/api-proxy/v4/metadata/one-list-tier')  && resp.status() === 200),
    page.waitForResponse(resp => resp.url().includes('/api-proxy/v4/reminder/summary')  && resp.status() === 200),
    page.waitForResponse(resp => resp.url().includes('/api-proxy/v3/search/interaction')  && resp.status() === 200),
    page.goto('/interactions?sortby=date:desc&page=1'),
  ])
  
  await expect(page).toHaveTitle(/Interactions - DBT Data Hub/)
  await expect(page.getByRole('heading', {name: 'interactions', level: 2})).toContainText('interactions')
});
