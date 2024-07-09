import { test, expect } from '@playwright/test';

test('Contacts', async ({ page }) => {
  await page.goto('/contacts');
  await expect(page.getByRole('heading', {name: 'Contacts'})).toBeVisible()
})

test('Companies', async ({ page }) => {
  await page.goto('/companies');
  await expect(page.getByRole('heading', {name: 'Companies'})).toBeVisible()
})
