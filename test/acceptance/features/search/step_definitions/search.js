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
  const Company = client.page.Company()

  When(/^I populate the create event form to search$/, async function () {
    const eventName = appendUid(faker.company.companyName())

    await Event
      .populateCreateEventForm({ name: eventName }, true, (event) => set(this.state, 'event', event))
  })

  When(/^a company is created to search$/, async function () {
    const companyName = appendUid(faker.company.companyName())

    await Company
      .createUkNonPrivateOrNonPublicLimitedCompany({
        details: { name: companyName },
        callback: (company) => set(this.state, 'company', company),
      })
  })

  When(/^I search for the event$/, async function () {
    await Search
      .search(getUid(this.state.event.name))
  })

  When(/^I search for the company/, async function () {
    await Search
      .search(getUid(this.state.company.name))
  })

  When(/^I click the Events tab/, async () => {
    await Search.section.tabs
      .click('@events')
  })

  Then(/^I verify the tabs are displayed$/, async () => {
    await Search.section.tabs
      .assert.visible('@companies')
      .assert.visible('@contacts')
      .assert.visible('@events')
      .assert.visible('@interactions')
      .assert.visible('@investmentProjects')
      .assert.visible('@orders')
  })

  Then(/^the (.+) tab is active/, async (tabName) => {
    await Search.section.tabs
      .assert.cssClassPresent(`@${tabName}`, 'is-active')
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
    const registeredAddress = `${this.state.company.address1}, ${this.state.company.town}`
    await Search.section.firstCompanySearchResult
      .waitForElementPresent('@header')
      .assert.containsText('@header', this.state.company.name)
      .assert.containsText('@sector', this.state.company.sector)
      .assert.containsText('@registeredAddress', registeredAddress)
  })
})
