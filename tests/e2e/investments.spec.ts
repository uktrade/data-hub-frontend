import { test, expect } from '@playwright/test';

test.describe('investments', () => {
  test('investment projects list', async ({ browser, page }) => {
    const [response] = await Promise.all([
      page.waitForResponse(resp => resp.url().includes('/api-proxy/v4/metadata/country')),
      page.waitForResponse(resp => resp.url().includes('/api-proxy/v4/metadata/investment-type')),
      page.waitForResponse(resp => resp.url().includes('/api-proxy/v4/metadata/likelihood-to-land')),
      page.waitForResponse(resp => resp.url().includes('/api-proxy/v4/metadata/investment-project-stage')),
      page.waitForResponse(resp => resp.url().includes('/api-proxy/v4/metadata/sector')),
      page.waitForResponse(resp => resp.url().includes('/api-proxy/v4/metadata/uk-region')),
      page.waitForResponse(resp => resp.url().includes('/api-proxy/v4/reminder/summary')),
      page.waitForResponse(resp => resp.url().includes('/api-proxy/v3/search/investment_project')),
      page.goto('/investments'),
    ])
    
    await expect(page).toHaveTitle(/Projects - Investments - DBT Data Hub/)
    await expect(page.getByRole('heading', {name: 'Projects', level: 1})).toBeVisible()
    await expect(page.getByRole('heading', {name: 'investment projects', level: 2})).toContainText('investment projects')
  });
});
