import { test, expect } from '@playwright/test';

test('Contacts', async ({ page }) => {
  await page.goto('https://datahub.prod.uktrade.digital/contacts');
  await expect(page.getByRole('heading', {name: 'Contacts'})).toBeVisible()
})

test('Companies', async ({ page }) => {
  await page.goto('https://datahub.prod.uktrade.digital/companies');
  await expect(page.getByRole('heading', {name: 'Companies'})).toBeVisible()
})
