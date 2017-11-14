const { client } = require('nightwatch-cucumber')
const { defineSupportCode } = require('cucumber')
const { get, set } = require('lodash')

const { getUid } = require('../../../helpers/uuid')

defineSupportCode(({ Given, Then, When }) => {
  const CompanyList = client.page.CompanyList()

  When(/^I click on the first company collection link$/, async function () {
    await CompanyList
      .section.firstCompanyInList
      .waitForElementVisible('@header')
      .click('@header')
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
      .clickListOption('country', this.state.company.country)
      .wait() // wait for xhr
  })

  When(/^I filter the companies list by UK region/, async function () {
    await CompanyList.section.filters
      .waitForElementPresent('@ukRegion')
      .clickListOption('uk_region', this.state.company.ukRegion)
      .wait() // wait for xhr
  })

  When(/^the companies are sorted by (Company name: A-Z|Recently updated)$/, async function (sortOption) {
    await CompanyList
      .section.collectionHeader
      .waitForElementVisible('@sortBy')
      .clickListOption('sortby', sortOption)
      .wait() // wait for xhr

    await CompanyList
      .section.firstCompanyInList
      .getText('@header', (result) => {
        set(this.state, 'collection.firstItem.field', result.value)
      })
  })

  When(/^the companies are sorted by (Company name: Z-A|Least recently updated)$/, async function (sortOption) {
    await CompanyList
      .section.collectionHeader
      .waitForElementVisible('@sortBy')
      .clickListOption('sortby', sortOption)
      .wait() // wait for xhr

    await CompanyList
      .section.firstCompanyInList
      .getText('@header', (result) => {
        set(this.state, 'collection.lastItem.field', result.value)
      })
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

  Then(/^the companies should have been correctly sorted by updated date$/, async function () {
    const firstItemField = get(this.state, 'collection.firstItem.field')
    const lastItemField = get(this.state, 'collection.lastItem.field')
    const expectedFirstItemField = get(this.state, 'company.header')
    const expectedLastItemField = this.fixtures.company.foreign.name

    client.expect(firstItemField).to.equal(expectedFirstItemField)
    client.expect(lastItemField).to.equal(expectedLastItemField)
  })

  Then(/^the companies should have been correctly sorted for text fields$/, async function () {
    const firstItemField = get(this.state, 'collection.firstItem.field')
    const lastItemField = get(this.state, 'collection.lastItem.field')

    return client.expect(firstItemField < lastItemField).to.be.true
  })
})
