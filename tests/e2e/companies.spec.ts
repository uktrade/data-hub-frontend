import { test, expect } from '@playwright/test';
import { getCompanyId } from './utils'; 

test.describe('companies', () => {
  test('list', async ({ browser, page }) => {
    const [response] = await Promise.all([
      page.waitForResponse(resp => resp.url().includes('/api-proxy/v4/metadata/sector?level__lte=0')),
      page.waitForResponse(resp => resp.url().includes('/api-proxy/v4/metadata/sector?level__gte=1')),
      page.waitForResponse(resp => resp.url().includes('/api-proxy/v4/metadata/headquarter-type')),
      page.waitForResponse(resp => resp.url().includes('/api-proxy/v4/metadata/uk-region')),
      page.waitForResponse(resp => resp.url().includes('/api-proxy/v4/metadata/administrative-area?country=81756b9a-5d95-e211-a939-e4115bead28a')),
      page.waitForResponse(resp => resp.url().includes('/api-proxy/v4/metadata/administrative-area?country=5daf72a6-5d95-e211-a939-e4115bead28a')),
      page.waitForResponse(resp => resp.url().includes('/api-proxy/v4/metadata/country')),
      page.waitForResponse(resp => resp.url().includes('/api-proxy/v4/reminder/summary')),
      page.waitForResponse(resp => resp.url().includes('/api-proxy/v4/search/company')),
      page.goto('/companies?archived[0]=false&sortby=modified_on:desc&page=1'),
    ])
    
    await expect(page).toHaveTitle(/Companies - DBT Data Hub/)
    await expect(page.getByRole('heading', {name: 'Companies', level: 1})).toBeVisible()
    await expect(page.getByRole('heading', {name: 'companies', level: 2})).toContainText('companies')
  });

  test('company overview', async ({ browser, page, baseURL }) => {
    const companyId = getCompanyId(baseURL)

    const companyInfo = `/api-proxy/v4/company/${companyId}`
    const companyList = `/api-proxy/v4/company-list?items__company_id=${companyId}`
    // Export wins seems to be flakey at the moment.
    // const exportWin = `/api-proxy/v4/company/${companyId}/export-win`
    const dnbCount = `/api-proxy/v4/dnb/${companyId}/related-companies/count?include_manually_linked_companies=true`
    const interaction = `/api-proxy/v3/search/interaction`


    const [response] = await Promise.all([
      page.waitForResponse(resp => resp.url().includes(companyInfo)),
      page.waitForResponse(resp => resp.url().includes(companyList)),
      // page.waitForResponse(resp => resp.url().includes(exportWin)),
      page.waitForResponse(resp => resp.url().includes(dnbCount)),
      page.waitForResponse(resp => resp.url().includes(interaction)),
      page.goto(`/companies/${companyId}/overview`)
    ])

    await expect(page.getByRole('caption')).toHaveCount(7)
  });


  test('company contacts', async ({ browser, page, baseURL }) => {
    const companyId = getCompanyId(baseURL)

    const companyInfo = `/api-proxy/v4/company/${companyId}`
    const companyList = `/api-proxy/v4/company-list?items__company_id=${companyId}`
    // Export wins seems to be flakey at the moment.
    // const exportWin = `/api-proxy/v4/company/${companyId}/export-win`
    const dnbCount = `/api-proxy/v4/dnb/${companyId}/related-companies/count?include_manually_linked_companies=true`
    const contact = `/api-proxy/v3/search/contact`


    const [response] = await Promise.all([
      page.waitForResponse(resp => resp.url().includes(`/api-proxy/v4/reminder/summary`)),
      page.waitForResponse(resp => resp.url().includes(companyInfo)),
      // page.waitForResponse(resp => resp.url().includes(exportWin)),
      page.waitForResponse(resp => resp.url().includes(dnbCount)),
      page.waitForResponse(resp => resp.url().includes(companyList)),
      page.waitForResponse(resp => resp.url().includes(contact)),
      page.goto(`/companies/${companyId}/contacts`),
    ])

    await expect(page.getByRole('heading', {name: 'contacts', level: 2})).toContainText('contacts')
  });
  
});


