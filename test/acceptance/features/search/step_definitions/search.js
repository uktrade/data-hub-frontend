/* eslint-disable camelcase */
const { client } = require('nightwatch-cucumber')
const { defineSupportCode } = require('cucumber')
const faker = require('faker')
const { getDateFor } = require('../../../common/date')

defineSupportCode(({ Then, When, Before }) => {
  const Event = client.page.Event()
  const Search = client.page.Search()

  Before(() => {
    Event.state = {
      eventDetails: {},
    }
    Search.state = {
      eventName: `${faker.company.companyName()} ${faker.random.uuid()}`,
    }
  })

  When(/^I populate the create event form to search$/, async () => {
    await Event
      .populateCreateEventForm({ name: Search.state.eventName })
  })

  When(/^I search for the event$/, async () => {
    await Search
      .waitForElementPresent('@term')
      .setValue('@term', Search.state.eventName)
      .sendKeys('@term', [ client.Keys.ENTER ])
      .wait() // wait for xhr
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

  Then(/^I verify the Companies tab is active/, async () => {
    await Search.section.tabs
      .assert.cssClassPresent('@companies', 'is-active')
  })

  Then(/^I verify the Events tab is active/, async () => {
    await Search.section.tabs
      .assert.cssClassPresent('@events', 'is-active')
  })

  Then(/^I verify there is a results count ([0-9]+)/, async (resultsCount) => {
    await Search
      .assert.visible('@resultsCount')
      .assert.containsText('@resultsCount', resultsCount)
  })

  Then(/^I can view the event in the search results/, async () => {
    const {
      start_date_year,
      start_date_month,
      start_date_day,
      end_date_year,
      end_date_month,
      end_date_day,
    } = Event.state.eventDetails

    const expectedStartDate = getDateFor({ year: start_date_year, month: start_date_month, day: start_date_day })
    const expectedEndDate = getDateFor({ year: end_date_year, month: end_date_month, day: end_date_day })

    await Search.section.firstEventSearchResult
      .waitForElementPresent('@header')
      .assert.containsText('@header', Event.state.eventDetails.name)
      .assert.containsText('@eventType', Event.state.eventDetails.event_type)
      .assert.containsText('@country', Event.state.eventDetails.address_country)
      .assert.containsText('@eventStart', expectedStartDate)
      .assert.containsText('@eventEnd', expectedEndDate)
      .assert.containsText('@organiser', Event.state.eventDetails.organiser)
      .assert.containsText('@leadTeam', Event.state.eventDetails.lead_team)
  })
})
