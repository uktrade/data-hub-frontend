/* eslint-disable camelcase */
const { client } = require('nightwatch-cucumber')
const { defineSupportCode } = require('cucumber')
const faker = require('faker')

const { getDateFor } = require('../../../helpers/date')

defineSupportCode(({ Then, When, Before }) => {
  const Event = client.page.Event()
  const Search = client.page.Search()
  const Company = client.page.Company()

  const getFakeName = (name) => {
    return {
      name: name,
      suffix: faker.random.uuid(),
      getFullName () {
        return `${this.name} ${this.suffix}`
      },
    }
  }

  Before(() => {
    Event.state = {
      eventDetails: {},
    }
    Company.state = {
      companyDetails: {},
    }
    Search.state = {
      eventName: getFakeName(faker.company.companyName()),
      companyName: getFakeName(faker.company.companyName()),
    }
  })

  When(/^I populate the create event form to search$/, async () => {
    await Event
      .populateCreateEventForm({ name: Search.state.eventName.getFullName() })
  })

  When(/^a company is created to search$/, async () => {
    await Company
      .createUkNonPrivateOrNonPublicLimitedCompany(Search.state.companyName.getFullName())
  })

  When(/^I search for the event$/, async () => {
    await Search
      .waitForElementPresent('@term')
      .setValue('@term', Search.state.eventName.suffix)
      .sendKeys('@term', [ client.Keys.ENTER ])
      .wait() // wait for xhr
  })

  When(/^I search for the company/, async () => {
    await Search
      .waitForElementPresent('@term')
      .setValue('@term', Search.state.companyName.suffix)
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

  Then(/^the (.+) tab is active/, async (tabName) => {
    await Search.section.tabs
      .assert.cssClassPresent(`@${tabName}`, 'is-active')
  })

  Then(/^there is a results count ([0-9]+)/, async (resultsCount) => {
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

  Then(/^I can view the company in the search results/, async () => {
    const registeredAddress = `${Company.state.companyDetails.address1}, ${Company.state.companyDetails.town}`
    await Search.section.firstCompanySearchResult
      .waitForElementPresent('@header')
      .assert.containsText('@header', Company.state.companyDetails.name)
      .assert.containsText('@sector', Company.state.companyDetails.sector)
      .assert.containsText('@registeredAddress', registeredAddress)
  })
})
