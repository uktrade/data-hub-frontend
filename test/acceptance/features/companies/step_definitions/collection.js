const { client } = require('nightwatch-cucumber')
const { defineSupportCode } = require('cucumber')
const { get } = require('lodash')

const { getUid } = require('../../../helpers/uuid')

defineSupportCode(({ Given, Then, When }) => {
  const Company = client.page.Company()
  const CompanyList = client.page.CompanyList()

  When(/^I click on the first company collection link$/, async function () {
    await Company
      .click('@firstCompanyFromList')
  })

  When(/^I filter the companies list by company/, async function () {
    await CompanyList.section.filters
      .waitForElementPresent('@company')
      .setValue('@company', getUid(this.state.company.name))
      .sendKeys('@company', [ client.Keys.ENTER ])
      .wait() // wait for xhr
  })

  When(/^I filter the companies list by sector$/, async function () {
    await CompanyList.section.filters
      .waitForElementPresent('@sector')
      .clickListOption('sector', this.state.company.sector)
      .wait() // wait for xhr
  })

  When(/^I filter the companies list by country$/, async function () {
    await CompanyList.section.filters
      .waitForElementPresent('@country')
      .clickListOption('trading_address_country', this.state.company.country)
      .wait() // wait for xhr
  })

  When(/^I filter the companies list by UK region/, async function () {
    await CompanyList.section.filters
      .waitForElementPresent('@ukRegion')
      .clickListOption('uk_region', this.state.company.ukRegion)
      .wait() // wait for xhr
  })

  Then(/^the companies should be filtered by company name/, async function () {
    const expected = get(this.state, `company.header`)

    await CompanyList
      .section.firstCompanyInList
      .waitForElementVisible('@header')
      .assert.containsText('@header', expected)
  })

  Then(/^the companies should be filtered by company sector$/, async function () {
    const expected = get(this.state, `company.sector`)

    await CompanyList
      .section.firstCompanyInList
      .waitForElementVisible('@companySector')
      .assert.containsText('@companySector', expected)
  })

  Then(/^the companies should be filtered to show badge company country$/, async function () {
    const expectedBadgeText = get(this.state, 'company.country')

    await CompanyList
      .section.firstCompanyInList
      .waitForElementVisible('@countryBadge')
      .assert.containsText('@countryBadge', expectedBadgeText)
  })

  Then(/^the companies should be filtered to show badge company UK region/, async function () {
    const expectedBadgeText = get(this.state, 'company.ukRegion')

    await CompanyList
      .section.firstCompanyInList
      .waitForElementVisible('@ukRegionBadge')
      .assert.containsText('@ukRegionBadge', expectedBadgeText)
  })
})
