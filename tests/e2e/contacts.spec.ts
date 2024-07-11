import { test, expect } from '@playwright/test';
import { getCompanyId } from './utils'; 
 
test.describe('contacts', () => {
  test('list', async ({ browser, page }) => {
    const [response] = await Promise.all([
      page.waitForResponse(resp => resp.url().includes('/api-proxy/v4/metadata/sector')),
      page.waitForResponse(resp => resp.url().includes('/api-proxy/v4/metadata/country')),
      page.waitForResponse(resp => resp.url().includes('/api-proxy/v4/metadata/uk-region')),
      page.waitForResponse(resp => resp.url().includes('/api-proxy/v4/reminder/summary')),
      page.waitForResponse(resp => resp.url().includes('/api-proxy/v3/search/contact')),
      page.goto('/contacts?archived[0]=false&sortby=modified_on:desc&page=1'),
    ])
    
    await expect(page).toHaveTitle(/Contacts - DBT Data Hub/)
    await expect(page.getByRole('heading', {name: 'Contacts', level: 1})).toBeVisible()
    await expect(page.getByRole('heading', {name: 'contacts', level: 2})).toContainText('contacts')
  });

  test('create contact form [view only]', async ({ baseURL, page }) => {
    const companyId = getCompanyId(baseURL)

    const [response] = await Promise.all([
      page.waitForResponse(resp => resp.url().includes('/api-proxy/v4/metadata/administrative-area')),
      page.waitForResponse(resp => resp.url().includes('/api-proxy/v4/reminder/summary') ),
      page.waitForResponse(resp => resp.url().includes(`api-proxy/v4/company/${companyId}`)),
      page.goto(`/contacts/create?company=${companyId}`),
    ])
    
    await expect(page).toHaveTitle(/Contacts - DBT Data Hub/)
    await expect(page.getByRole('heading', {name: 'Add contact', level: 1})).toContainText('Add contact')
  });
});