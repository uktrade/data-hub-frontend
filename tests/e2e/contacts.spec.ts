import { test, expect } from '@playwright/test';
import { getCompanyId } from './companies.spec'; 
 
test('Contacts overview', async ({ browser, page }) => {
  const [response] = await Promise.all([
    page.waitForResponse(resp => resp.url().includes('/api-proxy/v4/metadata/sector') && resp.status() === 200),
    page.waitForResponse(resp => resp.url().includes('/api-proxy/v4/metadata/country') && resp.status() === 200),
    page.waitForResponse(resp => resp.url().includes('/api-proxy/v4/metadata/uk-region')  && resp.status() === 200),
    page.waitForResponse(resp => resp.url().includes('/api-proxy/v4/reminder/summary')  && resp.status() === 200),
    page.waitForResponse(resp => resp.url().includes('/api-proxy/v3/search/contact')  && resp.status() === 200),
    page.goto('/contacts?archived[0]=false&sortby=modified_on:desc&page=1'),
  ])
  
  await expect(page).toHaveTitle(/Contacts - DBT Data Hub/)
  await expect(page.getByRole('heading', {name: 'contacts', level: 2})).toContainText('contacts')
});

test('Create contact form [view only]', async ({ baseURL, page }) => {
  const companyId = getCompanyId(baseURL)

  const [response] = await Promise.all([
    page.waitForResponse(resp => resp.url().includes('/api-proxy/v4/metadata/administrative-area') && resp.status() === 200),
    page.waitForResponse(resp => resp.url().includes('/api-proxy/v4/reminder/summary')  && resp.status() === 200),
    page.waitForResponse(resp => resp.url().includes(`api-proxy/v4/company/${companyId}`) && resp.status() === 200),
    page.goto(`/contacts/create?company=${companyId}`),
  ])
  
  await expect(page).toHaveTitle(/Contacts - DBT Data Hub/)
  await expect(page.getByRole('heading', {name: 'Add contact', level: 1})).toContainText('Add contact')
});
