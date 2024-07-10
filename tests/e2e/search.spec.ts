import { test, expect } from '@playwright/test';

test.describe('search', () => {
  [
    { name: 'Companies', slug: 'companies' },
    { name: 'Contacts', slug: 'contacts' },
    { name: 'Events', slug: 'events' },
    { name: 'Interactions', slug: 'interactions' },
    { name: 'Investment projects', slug: 'investment-projects' },
    { name: 'Orders', slug: 'omis' },
  ].forEach(({ name, slug }) => {
    test(`${name}`, async ({ page }) => {
      await page.goto(`/search/${slug}?term=test`),
    
      await expect(page).toHaveTitle(`${name} - Search - DBT Data Hub`)
      await expect(page.getByRole('heading', {name: 'results matching test'})).toBeVisible()
    });
  });
});
