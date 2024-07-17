import { test, expect } from '@playwright/test';

test('dashboard', async ({ browser, page }) => {
  const [response] = await Promise.all([
    page.waitForResponse(resp => resp.url().includes('/api-proxy/v4/reminder/summary')),
    page.waitForResponse(resp => resp.url().includes('/api-proxy/v4/search/task')),
    page.waitForResponse(resp => resp.url().includes('/api-proxy/v3/search/investment_project')),
    page.goto('/'),
  ])
  
  await expect(page).toHaveTitle(/Dashboard - DBT Data Hub/)

  // Only check for elements that appear regardless whether there are items as we don't know
  // what the user has in their lists.
  await page.getByRole('tab', { name: 'Tasks' }).click();
  await expect(page.locator('a[href="/tasks/create"]')).toHaveCount(1)
  await page.getByRole('tab', { name: 'Company lists' }).click();
  await expect(page.getByRole('heading', {name: 'My companies lists'})).toBeVisible()
  // Investment projects shows two completely different pages depending if there are any.
  // await page.getByRole('tab', { name: 'Investment projects' }).click();
  await page.getByRole('tab', { name: 'Export projects' }).click();
  await expect(page.locator('a[href="/exportwins"]')).toHaveCount(1)  
  await page.getByRole('tab', { name: 'Referrals' }).click();
  await expect(page.getByRole('heading', {name: 'received referrals'})).toBeVisible()
});
