const { get, set, find, assign } = require('lodash')

const { client } = require('nightwatch-cucumber')
const { defineSupportCode } = require('cucumber')
const { getUid } = require('../../../helpers/uuid')

const companySearchPage = `${process.env.QA_HOST}/search/companies` // TODO move these urls out into a url world object
const dashboardPage = `${process.env.QA_HOST}/`

defineSupportCode(({ Then, When }) => {
  const Company = client.page.Company()
  const Search = client.page.Search()
  const Location = client.page.Location()

  When(/^I navigate to the Company (.+)$/, async function (companyName) {
    const companyFixtureDetails = find(this.fixtures.company, ['name', companyName])
    set(this.state, 'company', assign({}, get(this.state, 'company'), companyFixtureDetails))

    await Search
      .navigate()
      .search(companyName)
      .section.firstCompanySearchResult
      .waitForElementPresent('@header')
      .click('@header')

    await Location
      .section.localHeader
      .waitForElementPresent('@header')
      .assert.containsText('@header', companyName)
  })

  When(/^I navigate to the companies (.+) page$/, async function (pageName) { // TODO please use work in Location (remove this)
    const tag = `@${pageName}`

    await Location
      .section.detailsTabs
      .waitForElementPresent(tag)
      .click(tag)
  })

  When(/^a "UK private or public limited company" is created$/, async function () {
    await client
      .url(companySearchPage)

    await Company
      .createUkPrivateOrPublicLimitedCompany(
        get(this.fixtures, 'company.companiesHouse'),
        {},
        (company) => set(this.state, 'company', company),
      )
      .wait() // wait for backend to sync
  })

  When(/^a "UK non-private or non-public limited company" is created$/, async function () {
    await client
      .url(companySearchPage)

    await Company
      .createUkNonPrivateOrNonPublicLimitedCompany({}, (company) => {
        set(this.state, 'company', company)
      })
      .wait() // wait for backend to sync
  })

  When(/^a new "Foreign company" is created$/, async function () {
    await client
      .url(companySearchPage)

    await Company
      .createForeignCompany({}, (company) => set(this.state, 'company', company))
      .wait() // wait for backend to sync
  })

  Then(/^the company is in the search results$/, async function () {
    const companyName = get(this.state, 'company.name', get(this.state, 'company.tradingName'))

    await client
      .url(dashboardPage)

    await Company
      .findCompany(getUid(companyName))
      .assert.containsText('@collectionResultsCompanyName', companyName)
  })

  Then(/^the company trading name is in the search results$/, async function () {
    const companyName = get(this.state, 'company.tradingName')

    await client
      .url(dashboardPage)

    await Search
      .navigate()
      .search(companyName)
      .section.firstCompanySearchResult
      .waitForElementPresent('@tradingName')
      .assert.containsText('@tradingName', companyName)
  })
})
