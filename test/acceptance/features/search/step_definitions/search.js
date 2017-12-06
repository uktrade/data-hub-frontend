/* eslint-disable camelcase */
const { set } = require('lodash')
const faker = require('faker')

const { client } = require('nightwatch-cucumber')
const { defineSupportCode } = require('cucumber')
const { getDateFor } = require('../../../helpers/date')
const { getUid, appendUid } = require('../../../helpers/uuid')

defineSupportCode(function ({ Then, When }) {
  const Event = client.page.Event()
  const Search = client.page.Search()
  const Dashboard = client.page.Dashboard()

  When(/^I populate the create event form to search$/, async function () {
    const eventName = appendUid(faker.company.companyName())

    await Event
      .populateCreateEventForm({ name: eventName }, true, (event) => set(this.state, 'event', event))
  })

  When(/^I search for the event$/, async function () {
    await Dashboard
      .navigate()

    await Search
      .search(getUid(this.state.event.name))
  })

  When(/^I search for the company/, async function () {
    await Dashboard
      .navigate()

    await Search
      .search(getUid(this.state.company.name))
  })

  When(/^I search for the contact/, async function () {
    await Dashboard
      .navigate()

    await Search
      .search(getUid(this.state.contact.lastName))
  })

  When(/^the (.+) search tab is clicked/, async (tabText) => {
    const searchTabSelector = Search.section.tabs.getSearchResultsTabSelector(tabText)

    await Search.section.tabs
      .api.useXpath()
      .waitForElementVisible(searchTabSelector.selector)
      .click(searchTabSelector.selector)
      .useCss()
  })

  When(/^the first search result is clicked/, async () => {
    await Search
      .section.firstSearchResult
      .waitForElementVisible('@header')
      .click('@header')
  })

  Then(/^I verify the search tabs are displayed$/, async (expectedSearchTabs) => {
    for (const expectedSearchTab of expectedSearchTabs.hashes()) {
      const searchTabSelector = Search.section.tabs.getSearchResultsTabSelector(expectedSearchTab.text)

      await Search.section.tabs
        .api.useXpath()
        .waitForElementPresent(searchTabSelector.selector)
        .assert.visible(searchTabSelector.selector)
        .useCss()
    }
  })

  Then(/^the (.+) search tab is active/, async (tabText) => {
    const searchTabSelector = Search.section.tabs.getSearchResultsTabSelector(tabText)

    await Search.section.tabs
      .api.useXpath()
      .waitForElementPresent(searchTabSelector.selector)
      .assert.cssClassPresent(searchTabSelector.selector, 'is-active')
      .useCss()
  })

  Then(/^there is a results count ([0-9]+)/, async (resultsCount) => {
    await Search
      .assert.visible('@resultsCount')
      .assert.containsText('@resultsCount', resultsCount)
  })

  Then(/^I can view the event in the search results/, async function () {
    const {
      start_date_year,
      start_date_month,
      start_date_day,
      end_date_year,
      end_date_month,
      end_date_day,
    } = this.state.event

    const expectedStartDate = getDateFor({ year: start_date_year, month: start_date_month, day: start_date_day })
    const expectedEndDate = getDateFor({ year: end_date_year, month: end_date_month, day: end_date_day })

    await Search.section.firstEventSearchResult
      .waitForElementPresent('@header')
      .assert.containsText('@header', this.state.event.name)
      .assert.containsText('@eventType', this.state.event.event_type)
      .assert.containsText('@country', this.state.event.address_country)
      .assert.containsText('@eventStart', expectedStartDate)
      .assert.containsText('@eventEnd', expectedEndDate)
      .assert.containsText('@organiser', this.state.event.organiser)
      .assert.containsText('@leadTeam', this.state.event.lead_team)
  })

  Then(/^I can view the company in the search results/, async function () {
    const {
      name,
      sector,
      primaryAddress,
    } = this.state.company

    await Search.section.firstCompanySearchResult
      .waitForElementPresent('@header')
      .assert.containsText('@header', name)
      .assert.containsText('@sector', sector)
      .assert.containsText('@registeredAddress', primaryAddress)
  })
})
