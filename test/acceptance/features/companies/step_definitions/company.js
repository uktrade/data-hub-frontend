const { get, set } = require('lodash')

const { client } = require('nightwatch-cucumber')
const { Then, When } = require('cucumber')

const { getUid } = require('../../../helpers/uuid')
const { company: companyFixtures } = require('../../../fixtures')

const companySearchPage = `${process.env.QA_HOST}/search/companies` // TODO move these urls out in the url property/function of page objects
const dashboardPage = `${process.env.QA_HOST}/`

const Company = client.page.companies.company()
const Search = client.page.search.search()

When(/^a "UK private or public limited company" is created$/, async function() {
  await client.url(companySearchPage)

  await Company.createUkPrivateOrPublicLimitedCompany(
    companyFixtures.companiesHouse,
    {},
    (company) => set(this.state, 'company', company)
  ).wait() // wait for backend to sync
})

When(
  /^a "UK non-private or non-public limited company" is created$/,
  async function() {
    await client.url(companySearchPage)

    await Company.createUkNonPrivateOrNonPublicLimitedCompany({}, (company) => {
      set(this.state, 'company', company)
    }).wait() // wait for backend to sync
  }
)

When(/^a "Foreign company" is created$/, async function() {
  await client.url(companySearchPage)

  await Company.createForeignCompany({}, (company) =>
    set(this.state, 'company', company)
  ).wait() // wait for backend to sync
})

When(/^a "UK branch of a foreign company" is created$/, async function() {
  await client.url(companySearchPage)

  await Company.createUkBranchOfForeignCompany({}, (company) =>
    set(this.state, 'company', company)
  ).wait() // wait for backend to sync
})

Then(/^the company is in the search results$/, async function() {
  const companyName = get(
    this.state,
    'company.name',
    get(this.state, 'company.tradingName')
  )

  await client.url(dashboardPage)

  await Company.findCompany(getUid(companyName)).assert.containsText(
    '@collectionResultsCompanyName',
    companyName
  )
})

Then(/^the company trading name is in the search results$/, async function() {
  const tradingName = get(this.state, 'company.tradingName')

  await client.url(dashboardPage)

  await Search.navigate()
    .search(tradingName)
    .section.firstCompanySearchResult.waitForElementPresent('@tradingNames')
    .assert.containsText('@tradingNames', tradingName)
})
