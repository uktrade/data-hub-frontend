const { client } = require('nightwatch-cucumber')
const { defineSupportCode } = require('cucumber')
const { get, set, camelCase } = require('lodash')
const { compareDesc } = require('date-fns')

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

  When(/^the contacts are sorted by (Newest)$/, async function (sortOption) {
    await ContactList
      .section.collectionHeader
      .waitForElementVisible('@sortBy')
      .clickListOption('sortby', sortOption)
      .wait() // wait for xhr

    await ContactList
      .section.firstContactInList
      .getText('@header', (result) => {
        set(this.state, 'collection.firstItem.field', result.value)
      })
  })

  When(/^the contacts are sorted by (Oldest)$/, async function (sortOption) {
    await ContactList
      .section.collectionHeader
      .waitForElementVisible('@sortBy')
      .clickListOption('sortby', sortOption)
      .wait() // wait for xhr

    await ContactList
      .section.firstContactInList
      .getText('@header', (result) => {
        set(this.state, 'collection.lastItem.field', result.value)
      })
  })

  When(/^the contacts are sorted by (Recently updated)$/, async function (sortOption) {
    await ContactList
      .section.collectionHeader
      .waitForElementVisible('@sortBy')
      .clickListOption('sortby', sortOption)
      .wait() // wait for xhr

    await ContactList
      .section.firstContactInList
      .getText('@updated', (result) => {
        set(this.state, 'collection.firstItem.field', result.value)
      })
  })

  When(/^the contacts are sorted by (Least recently updated)$/, async function (sortOption) {
    await ContactList
      .section.collectionHeader
      .waitForElementVisible('@sortBy')
      .clickListOption('sortby', sortOption)
      .wait() // wait for xhr

    await ContactList
      .section.firstContactInList
      .getText('@updated', (result) => {
        set(this.state, 'collection.lastItem.field', result.value)
      })
  })

  When(/^the contacts are sorted by (First name: A-Z)$/, async function (sortOption) {
    await ContactList
      .section.collectionHeader
      .waitForElementVisible('@sortBy')
      .clickListOption('sortby', sortOption)
      .wait() // wait for xhr

    await ContactList
      .section.firstContactInList
      .getText('@header', (result) => {
        const name = result.value.split(' ')[0]
        set(this.state, 'collection.firstItem.field', name.toLowerCase())
      })
  })

  When(/^the contacts are sorted by (First name: Z-A)$/, async function (sortOption) {
    await ContactList
      .section.collectionHeader
      .waitForElementVisible('@sortBy')
      .clickListOption('sortby', sortOption)
      .wait() // wait for xhr

    await ContactList
      .section.firstContactInList
      .getText('@header', (result) => {
        const name = result.value.split(' ')[0]
        set(this.state, 'collection.lastItem.field', name.toLowerCase())
      })
  })

  When(/^the contacts are sorted by (Last name: A-Z)$/, async function (sortOption) {
    await ContactList
      .section.collectionHeader
      .waitForElementVisible('@sortBy')
      .clickListOption('sortby', sortOption)
      .wait() // wait for xhr

    await ContactList
      .section.firstContactInList
      .getText('@header', (result) => {
        const name = result.value.split(' ')[0]
        set(this.state, 'collection.firstItem.field', name.toLowerCase())
      })
  })

  When(/^the contacts are sorted by (Last name: Z-A)$/, async function (sortOption) {
    await ContactList
      .section.collectionHeader
      .waitForElementVisible('@sortBy')
      .clickListOption('sortby', sortOption)
      .wait() // wait for xhr

    await ContactList
      .section.firstContactInList
      .getText('@header', (result) => {
        const name = result.value.split(' ')[0]
        set(this.state, 'collection.lastItem.field', name.toLowerCase())
      })
  })

  When(/^the contacts are sorted by (Country: A-Z)$/, async function (sortOption) {
    await ContactList
      .section.collectionHeader
      .waitForElementVisible('@sortBy')
      .clickListOption('sortby', sortOption)
      .wait() // wait for xhr

    await ContactList
      .section.firstContactInList
      .getText('@countryBadge', (result) => {
        set(this.state, 'collection.firstItem.field', result.value.toLowerCase())
      })
  })

  When(/^the contacts are sorted by (Country: Z-A)$/, async function (sortOption) {
    await ContactList
      .section.collectionHeader
      .waitForElementVisible('@sortBy')
      .clickListOption('sortby', sortOption)
      .wait() // wait for xhr

    await ContactList
      .section.firstContactInList
      .getText('@countryBadge', (result) => {
        set(this.state, 'collection.lastItem.field', result.value.toLowerCase())
      })
  })

  When(/^the contacts are sorted by (Company: A-Z)$/, async function (sortOption) {
    await ContactList
      .section.collectionHeader
      .waitForElementVisible('@sortBy')
      .clickListOption('sortby', sortOption)
      .wait() // wait for xhr

    await ContactList
      .section.firstContactInList
      .getText('@companyName', (result) => {
        set(this.state, 'collection.firstItem.field', result.value.toLowerCase())
      })
  })

  When(/^the contacts are sorted by (Company: Z-A)$/, async function (sortOption) {
    await ContactList
      .section.collectionHeader
      .waitForElementVisible('@sortBy')
      .clickListOption('sortby', sortOption)
      .wait() // wait for xhr

    await ContactList
      .section.firstContactInList
      .getText('@companyName', (result) => {
        set(this.state, 'collection.lastItem.field', result.value.toLowerCase())
      })
  })

  When(/^the contacts are sorted by (Sector: A-Z)$/, async function (sortOption) {
    await ContactList
      .section.collectionHeader
      .waitForElementVisible('@sortBy')
      .clickListOption('sortby', sortOption)
      .wait() // wait for xhr

    await ContactList
      .section.firstContactInList
      .getText('@companySector', (result) => {
        set(this.state, 'collection.firstItem.field', result.value.toLowerCase())
      })
  })

  When(/^the contacts are sorted by (Sector: Z-A)$/, async function (sortOption) {
    await ContactList
      .section.collectionHeader
      .waitForElementVisible('@sortBy')
      .clickListOption('sortby', sortOption)
      .wait() // wait for xhr

    await ContactList
      .section.firstContactInList
      .getText('@companySector', (result) => {
        set(this.state, 'collection.lastItem.field', result.value.toLowerCase())
      })
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
    const expectedBadgeText = get(this.state, `${entityType}.${field}`)

    ContactList
      .section.firstContactInList
      .waitForElementVisible('@countryBadge')
      .assert.containsText('@countryBadge', expectedBadgeText)
  })

  Then(/^the contacts should have been correctly sorted for date fields$/, async function () {
    const firstItemField = get(this.state, `collection.firstItem.field`)
    const lastItemField = get(this.state, `collection.lastItem.field`)

    client.expect(compareDesc(firstItemField, lastItemField)).to.be.within(0, 1)
  })

  Then(/^the contacts should have been correctly sorted by creation date$/, async function () {
    const firstItemField = get(this.state, `collection.firstItem.field`)
    const lastItemField = get(this.state, `collection.lastItem.field`)
    const expectedFirstItemField = get(this.state, 'contact.header')
    const expectedLastItemField = this.fixtures.contact.georginaClark.name

    client.expect(firstItemField).to.equal(expectedFirstItemField)
    client.expect(lastItemField).to.equal(expectedLastItemField)
  })

  Then(/^the contacts should have been correctly sorted for text fields$/, async function () {
    const firstItemField = get(this.state, `collection.firstItem.field`)
    const lastItemField = get(this.state, `collection.lastItem.field`)

    return client.expect(firstItemField < lastItemField).to.be.true
  })
})
