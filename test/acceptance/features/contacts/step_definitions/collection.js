const { client } = require('nightwatch-cucumber')
const { defineSupportCode } = require('cucumber')
const { get, camelCase } = require('lodash')

const { getUid } = require('../../../helpers/uuid')

defineSupportCode(({ Given, Then, When }) => {
  const Contact = client.page.Contact()
  const ContactList = client.page.ContactList()

  When(/^I click on the first contact collection link$/, async function () {
    await Contact
      .click('@firstCompanyFromList')
  })
  When(/^I filter the contacts list by company/, async function () {
    await ContactList.section.filters
      .waitForElementPresent('@company')
      .setValue('@company', getUid(this.state.company.name))
      .sendKeys('@company', [ client.Keys.ENTER ])
      .wait() // wait for xhr
  })

  When(/^I filter the contacts list by sector$/, async function () {
    await ContactList.section.filters
      .waitForElementPresent('@sector')
      .clickListOption('company_sector', this.state.company.sector)
      .wait() // wait for xhr
  })

  When(/^I filter the contacts list by country$/, async function () {
    await ContactList.section.filters
      .waitForElementPresent('@country')
      .clickListOption('address_country', this.state.company.country)
      .wait() // wait for xhr
  })

  When(/^I filter the contacts list by UK region/, async function () {
    await ContactList.section.filters
      .waitForElementPresent('@ukRegion')
      .clickListOption('company_uk_region', this.state.company.ukRegion)
      .wait() // wait for xhr
  })

  When(/^the (.+) filter is cleared$/, async function (filterName) {
    await ContactList.section.filterTags
      .click(`@${filterName}`)
      .wait() // wait for xhr
  })

  Then(/^the contacts should be filtered by ([A-Za-z]+) ([A-Za-z]+)$/, async function (entityType, field) {
    const entityTypeField = camelCase(`${entityType} ${field}`)
    const selector = `@${entityTypeField}`
    const expected = get(this.state, `${entityType}.${field}`)

    await ContactList.section.firstContactInList
      .waitForElementVisible(selector)
      .assert.containsText(selector, expected)
  })

  Then(/^the contacts should be filtered to show badge ([A-Za-z]+) ([A-Za-z]+)$/, async function (entityType, field) {
    const badgeText = get(this.state, `${entityType}.${field}`)
    const badge = ContactList.section.firstContactInList
      .getSelectorForBadgeWithText(badgeText)

    await ContactList.section.firstContactInList
      .api.useXpath()
      .assert.visible(badge.selector)
      .useCss()
  })
})
