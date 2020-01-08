const { client } = require('nightwatch-cucumber')
const { Then, When } = require('cucumber')
const { get, set, camelCase } = require('lodash')
const { compareDesc } = require('date-fns')

const { contact: contactFixtures } = require('../../../fixtures')
const { getUid } = require('../../../helpers/uuid')

const Contact = client.page.contacts.contact()
const ContactList = client.page.contacts.list()

When(/^I click on the first contact collection link$/, async function() {
  await Contact.click('@firstCompanyFromList')
})

When(/^I filter the contacts list by contact/, async function() {
  await ContactList.section.filters
    .waitForElementPresent('@contact')
    .setValue('@contact', getUid(this.state.contact.lastName))
    .sendKeys('@contact', [client.Keys.ENTER])
    .wait() // wait for xhr
})

When(/^I filter the contacts list by company/, async function() {
  await ContactList.section.filters
    .waitForElementPresent('@company')
    .setValue('@company', this.state.company.name)
    .sendKeys('@company', [client.Keys.ENTER])
    .wait() // wait for xhr
})

When(/^I filter the contacts list by country$/, async function() {
  await ContactList.section.filters
    .waitForElementPresent('@country')
    .clickMultipleChoiceOption('address_country', this.state.company.country)
    .wait() // wait for xhr
})

When(/^I filter the contacts list by UK region/, async function() {
  await ContactList.section.filters
    .waitForElementPresent('@ukRegion')
    .clickMultipleChoiceOption('company_uk_region', this.state.company.ukRegion)
    .wait() // wait for xhr
})

When(/^I filter the contacts list by inactive status/, async function() {
  await ContactList.section.filters
    .waitForElementPresent('@inactive')
    .click('@inactive')
    .wait() // wait for xhr
})

When(/^I filter the contacts list by active status/, async function() {
  await ContactList.section.filters
    .waitForElementPresent('@active')
    .click('@active')
    .wait() // wait for xhr
})

When(/^the contacts are sorted by (Newest)$/, async function(sortOption) {
  await ContactList.section.collectionHeader
    .waitForElementVisible('@sortBy')
    .clickListOption('sortby', sortOption)
    .wait() // wait for xhr

  await ContactList.section.firstContactInList.getText('@header', (result) => {
    set(this.state, 'collection.firstItem.field', result.value)
  })
})

When(/^the contacts are sorted by (Oldest)$/, async function(sortOption) {
  await ContactList.section.collectionHeader
    .waitForElementVisible('@sortBy')
    .clickListOption('sortby', sortOption)
    .wait() // wait for xhr

  await ContactList.section.firstContactInList.getText('@header', (result) => {
    set(this.state, 'collection.lastItem.field', result.value)
  })
})

When(/^the contacts are sorted by (Last name: A-Z)$/, async function(
  sortOption
) {
  await ContactList.section.collectionHeader
    .waitForElementVisible('@sortBy')
    .clickListOption('sortby', sortOption)
    .wait() // wait for xhr

  await ContactList.section.firstContactInList.getText('@header', (result) => {
    const name = result.value.split(' ')[0]
    set(this.state, 'list.firstItem.field', name)
  })

  await ContactList.section.secondContactInList.getText('@header', (result) => {
    const name = result.value.split(' ')[0]
    set(this.state, 'list.secondItem.field', name)
  })
})

When(/^the contacts are sorted by (Last name: Z-A)$/, async function(
  sortOption
) {
  await ContactList.section.collectionHeader
    .waitForElementVisible('@sortBy')
    .clickListOption('sortby', sortOption)
    .wait() // wait for xhr

  await ContactList.section.firstContactInList.getText('@header', (result) => {
    const name = result.value.split(' ')[0]
    set(this.state, 'list.firstItem.field', name)
  })

  await ContactList.section.secondContactInList.getText('@header', (result) => {
    const name = result.value.split(' ')[0]
    set(this.state, 'list.secondItem.field', name)
  })
})

When(/^the contacts are sorted by (Country: A-Z)$/, async function(sortOption) {
  await ContactList.section.collectionHeader
    .waitForElementVisible('@sortBy')
    .clickListOption('sortby', sortOption)
    .wait() // wait for xhr

  await ContactList.section.firstContactInList.getText(
    '@countryBadge',
    (result) => {
      set(this.state, 'list.firstItem.field', result.value)
    }
  )

  await ContactList.section.secondContactInList.getText(
    '@countryBadge',
    (result) => {
      set(this.state, 'list.secondItem.field', result.value)
    }
  )
})

When(/^the contacts are sorted by (Company: A-Z)$/, async function(sortOption) {
  await ContactList.section.collectionHeader
    .waitForElementVisible('@sortBy')
    .clickListOption('sortby', sortOption)
    .wait() // wait for xhr

  await ContactList.section.firstContactInList.getText(
    '@companyName',
    (result) => {
      set(this.state, 'collection.firstItem.field', result.value)
    }
  )

  await ContactList.section.secondContactInList.getText(
    '@companyName',
    (result) => {
      set(this.state, 'collection.secondItem.field', result.value)
    }
  )
})

Then(
  /^the contacts should be filtered by ([A-Za-z]+) ([A-Za-z]+)$/,
  async function(entityType, field) {
    const entityTypeField = camelCase(`${entityType} ${field}`)

    let selector
    let expected

    if (entityTypeField === 'contactName') {
      selector = '@header'
      expected = `${get(this.state, 'contact.firstName')} ${get(
        this.state,
        'contact.lastName'
      )}`
    } else {
      selector = `@${entityTypeField}`
      expected = get(this.state, `${entityType}.${field}`)
    }

    await ContactList.section.firstContactInList
      .waitForElementVisible(selector)
      .assert.containsText(selector, expected)
  }
)

Then(/^the contacts CSV download button should be visible/, async function() {
  await ContactList.section.collectionHeader
    .waitForElementVisible('@download')
    .assert.containsText('@download', 'Download')
})

Then(
  /^the contacts should be filtered to show badge ([A-Za-z]+) ([A-Za-z]+)$/,
  async function(entityType, field) {
    const expectedBadgeText = get(this.state, `${entityType}.${field}`)

    await ContactList.section.firstContactInList
      .waitForElementVisible('@countryBadge')
      .assert.containsText('@countryBadge', expectedBadgeText)
  }
)

Then(
  /^the contacts should have been correctly sorted for date fields$/,
  async function() {
    const firstItemField = get(this.state, `collection.firstItem.field`)
    const lastItemField = get(this.state, `collection.lastItem.field`)

    client.expect(compareDesc(firstItemField, lastItemField)).to.be.within(0, 1)
  }
)

// TODO make this work in the same way as the "companies should be sorted by (Least recently|Recently) updated" step does
// TODO or move it into collections
Then(
  /^the contacts should have been correctly sorted by creation date$/,
  async function() {
    const firstItemField = get(this.state, 'collection.firstItem.field')
    const lastItemField = get(this.state, 'collection.lastItem.field')
    const expectedFirstItemField = get(this.state, 'contact.heading')
    const expectedLastItemField = contactFixtures.georginaClark.name

    client.expect(firstItemField).to.equal(expectedFirstItemField)
    client.expect(lastItemField).to.equal(expectedLastItemField)
  }
)

Then(
  /^the contacts should have been correctly sorted for text fields$/,
  async function() {
    const firstItemField = get(this.state, 'collection.firstItem.field')
    const lastItemField = get(this.state, 'collection.lastItem.field')

    return client.expect(firstItemField < lastItemField).to.be.true
  }
)
