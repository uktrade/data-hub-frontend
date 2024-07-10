import { test, expect } from '@playwright/test';

test.describe('Investments', () => {
  test('Projects', async ({ browser, page }) => {
    const [response] = await Promise.all([
      page.waitForResponse(resp => resp.url().includes('/api-proxy/v4/metadata/country') && resp.status() === 200),
      page.waitForResponse(resp => resp.url().includes('/api-proxy/v4/metadata/investment-type') && resp.status() === 200),
      page.waitForResponse(resp => resp.url().includes('/api-proxy/v4/metadata/likelihood-to-land') && resp.status() === 200),
      page.waitForResponse(resp => resp.url().includes('/api-proxy/v4/metadata/investment-project-stage') && resp.status() === 200),
      page.waitForResponse(resp => resp.url().includes('/api-proxy/v4/metadata/sector') && resp.status() === 200),
      page.waitForResponse(resp => resp.url().includes('/api-proxy/v4/metadata/uk-region') && resp.status() === 200),
      page.waitForResponse(resp => resp.url().includes('/api-proxy/v4/reminder/summary') && resp.status() === 200),
      page.waitForResponse(resp => resp.url().includes('/api-proxy/v3/search/investment_project') && resp.status() === 200),
      page.goto('/investments/projects?page=1&sortby=created_on%3Adesc'),
    ])
    
    await expect(page).toHaveTitle(/Projects - Investments - DBT Data Hub/)
    await expect(page.getByRole('heading', {name: 'investment projects', level: 2})).toContainText('investment projects')
  });
});
