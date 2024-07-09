import { test, expect } from '@playwright/test';

test('Companies', async ({ browser, page }) => {
  const [response] = await Promise.all([
    page.waitForResponse(resp => resp.url().includes('/api-proxy/v4/metadata/sector?level__lte=0') 
      && resp.status() === 200),
    page.waitForResponse(resp => resp.url().includes('/api-proxy/v4/metadata/sector?level__gte=1') 
      && resp.status() === 200),
    page.waitForResponse(resp => resp.url().includes('/api-proxy/v4/metadata/headquarter-type?_=0') 
      && resp.status() === 200),
    page.waitForResponse(resp => resp.url().includes('/api-proxy/v4/metadata/uk-region?_=0') 
      && resp.status() === 200),
    page.waitForResponse(resp => resp.url().includes('/api-proxy/v4/metadata/administrative-area?country=81756b9a-5d95-e211-a939-e4115bead28a') 
      && resp.status() === 200),
    page.waitForResponse(resp => resp.url().includes('/api-proxy/v4/metadata/administrative-area?country=5daf72a6-5d95-e211-a939-e4115bead28a') 
      && resp.status() === 200),
    page.waitForResponse(resp => resp.url().includes('/api-proxy/v4/metadata/country?_=0') 
      && resp.status() === 200),
    page.waitForResponse(resp => resp.url().includes('/api-proxy/v4/reminder/summary') 
      && resp.status() === 200),
    page.waitForResponse(resp => resp.url().includes('/api-proxy/v4/search/company') 
      && resp.status() === 200),
    page.goto('/companies?archived[0]=false&sortby=modified_on:desc&page=1'),
  ])
  
  await expect(page).toHaveTitle(/Companies - DBT Data Hub/)
  await expect(page.getByRole('heading', {name: 'companies', level: 2})).toContainText('companies')
});

test('Company overivew', async ({ browser, page, baseURL }) => {
    const companyId = getCompanyId(baseURL)

    const companyInfo = `/api-proxy/v4/company/${companyId}`
    const companyList = `/api-proxy/v4/company-list?items__company_id=${companyId}`
    // const exportWin = `/api-proxy/v4/company/${companyId}/export-win`
    const dnbCount = `/api-proxy/v4/dnb/${companyId}/related-companies/count?include_manually_linked_companies=true`
    const interaction = `/api-proxy/v3/search/interaction`


    const [response] = await Promise.all([
      page.waitForResponse(resp => resp.url().includes(companyInfo) && resp.status() === 200),
      page.waitForResponse(resp => resp.url().includes(companyList) && resp.status() === 200),
      // page.waitForResponse(resp => resp.url().includes(exportWin) && resp.status() === 200),
      page.waitForResponse(resp => resp.url().includes(dnbCount) && resp.status() === 200),
      page.waitForResponse(resp => resp.url().includes(interaction) && resp.status() === 200),
      page.goto(`/companies/${companyId}/overview`)
    ])
  
    await expect(page.getByRole('caption')).toHaveCount(7)
  });

function getCompanyId(baseURL:string):string {
  // Get the id of a company in the database
  if (baseURL == 'https://datahub.prod.uktrade.digital') {
    // Test
    return 'ba664371-6654-480b-8fca-36ed060ae2a9'
  }
  // One list corp
  return '375094ac-f79a-43e5-9c88-059a7caa17f0'
}

