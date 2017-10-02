const { compareAsc, compareDesc } = require('date-fns')
const { client } = require('nightwatch-cucumber')
const { defineSupportCode } = require('cucumber')

const { getDateFor } = require('../../../common/date')

defineSupportCode(({ Then, When, Before }) => {
  const EventList = client.page.EventList()
  const Event = client.page.Event()

  Before(() => {
    Event.state = {
      eventDetails: {},
    }
    EventList.state = {
      list: {
        firstItem: {},
        secondItem: {},
      },
    }
  })

  When(/^I navigate to the event list page$/, async () => {
    await EventList
      .navigate()
      .waitForElementPresent('@h1Element')
  })

  When(/^I click the add an event link$/, async () => {
    await EventList
      .assert.elementPresent('@addEventButton')
      .click('@addEventButton')
  })

  When(/^I populate the create event form$/, async () => {
    await Event
      .populateCreateEventForm()
  })

  When(/^I populate the create event form with United Kingdom and a region$/, async () => {
    await Event
      .populateCreateEventForm({ addressCountry: 'United Kingdom' })
  })

  Then(/^I am taken to the create event page$/, async () => {
    await EventList
      .waitForElementPresent('@h1Element')
      .assert.urlEquals(`${EventList.url}/create`)
  })

  Then(/^I can view the event$/, async () => {
    await EventList.section.firstEventInList
      .waitForElementPresent('@header')
      .assert.containsText('@header', Event.state.eventDetails.name)
      .assert.containsText('@eventType', Event.state.eventDetails.event_type)
      .assert.containsText('@country', Event.state.eventDetails.address_country)
      .assert.containsText('@eventStart', getDateFor({
        year: Event.state.eventDetails.start_date_year,
        month: Event.state.eventDetails.start_date_month,
        day: Event.state.eventDetails.start_date_day,
      }))
      .assert.containsText('@eventEnd', getDateFor({
        year: Event.state.eventDetails.end_date_year,
        month: Event.state.eventDetails.end_date_month,
        day: Event.state.eventDetails.end_date_day,
      }))
      .assert.containsText('@organiser', Event.state.eventDetails.organiser)
      .assert.containsText('@leadTeam', Event.state.eventDetails.lead_team)
  })

  Then(/^I can view the event country and region$/, async () => {
    await EventList.section.firstEventInList
      .waitForElementPresent('@header')
      .assert.containsText('@country', Event.state.eventDetails.address_country)
      .assert.containsText('@ukRegion', Event.state.eventDetails.uk_region)
  })

  Then(/^I filter the events list by name$/, async () => {
    await EventList.section.filters
      .waitForElementPresent('@nameInput')
      .setValue('@nameInput', Event.state.eventDetails.name)
      .sendKeys('@nameInput', [ client.Keys.ENTER ])
      .wait() // wait for xhr

    await EventList.section.firstEventInList
      .waitForElementVisible('@header')
      .assert.containsText('@header', Event.state.eventDetails.name)

    // clear filter
    await EventList.section.filterTags
      .click('@eventName')
      .wait() // wait for xhr
  })

  Then(/^I filter the events list by organiser$/, async () => {
    await EventList.section.filters
      .waitForElementPresent('@organiser')
      .clickListOption('organiser', Event.state.eventDetails.organiser)
      .wait() // wait for xhr

    await EventList.section.firstEventInList
      .waitForElementVisible('@organiser')
      .assert.containsText('@organiser', Event.state.eventDetails.organiser)

    // clear filter
    await EventList.section.filterTags
      .click('@organiser')
      .wait() // wait for xhr
  })

  Then(/^I filter the events list by country/, async () => {
    await EventList.section.filters
      .waitForElementPresent('@country')
      .clickListOption('address_country', Event.state.eventDetails.address_country)
      .wait() // wait for xhr

    await EventList.section.firstEventInList
      .waitForElementVisible('@country')
      .assert.containsText('@country', Event.state.eventDetails.address_country)

    // clear filter
    await EventList.section.filterTags
      .click('@country')
      .wait() // wait for xhr
  })

  Then(/^I filter the events list by event type/, async () => {
    await EventList.section.filters
      .waitForElementPresent('@eventType')
      .clickListOption('event_type', Event.state.eventDetails.event_type)
      .wait() // wait for xhr

    await EventList.section.firstEventInList
      .waitForElementVisible('@eventType')
      .assert.containsText('@eventType', Event.state.eventDetails.event_type)

    // clear filter
    await EventList.section.filterTags
      .click('@eventType')
      .wait() // wait for xhr
  })

  Then(/^I filter the events list by start date/, async () => {
    const eventDetails = Event.state.eventDetails
    const startDate = getDateFor({
      year: eventDetails.start_date_year,
      month: eventDetails.start_date_month,
      day: eventDetails.start_date_day,
    })

    await EventList.section.filters
      .waitForElementPresent('@startDateAfter')
      .setValue('@startDateAfter', startDate)
      .sendKeys('@startDateAfter', [ client.Keys.ENTER ])
      .wait() // wait for xhr

    await EventList.section.firstEventInList
      .waitForElementVisible('@eventStart')
      .assert.containsText('@eventStart', startDate)

    // clear filter
    await EventList.section.filterTags
      .click('@fromDate')
      .wait() // wait for xhr
  })

  Then(/^I sort the events list name A-Z$/, async () => {
    await EventList
      .click('select[name="sortby"] option[value="name:asc"]')
      .wait()// wait for xhr

    await EventList.section.firstEventInList
      .waitForElementVisible('@header')
      .getText('@header', (text) => {
        EventList.state.list.firstItem.header = text.value
      })

    await EventList.section.secondEventInList
      .waitForElementVisible('@header')
      .getText('@header', (text) => {
        EventList.state.list.secondItem.header = text.value
      })
  })

  Then(/^I see the list in A-Z alphabetical order$/, async () => {
    client.expect(
      EventList.state.list.firstItem.header < EventList.state.list.secondItem.header
    ).to.be.true
  })

  Then(/^I sort the events list name Z-A$/, async () => {
    await EventList
      .click('select[name="sortby"] option[value="name:desc"]')
      .wait() // wait for xhr

    await EventList.section.firstEventInList
      .waitForElementVisible('@header')
      .getText('@header', (text) => {
        EventList.state.list.firstItem.header = text.value
      })

    await EventList.section.secondEventInList
      .waitForElementVisible('@header')
      .getText('@header', (text) => {
        EventList.state.list.secondItem.header = text.value
      })
  })

  Then(/^I see the list in Z-A alphabetical order$/, async () => {
    client.expect(
      EventList.state.list.firstItem.header > EventList.state.list.secondItem.header
    ).to.be.true
  })

  Then(/^I sort the events list by recently updated$/, async () => {
    await EventList
      .click('select[name="sortby"] option[value="modified_on:desc"]')
      .wait() // wait for xhr

    await EventList.section.firstEventInList
      .waitForElementVisible('@updated')
      .getText('@updated', (dateString) => {
        EventList.state.list.firstItem.updated = dateString.value
      })

    await EventList.section.secondEventInList
      .waitForElementVisible('@updated')
      .getText('@updated', (dateString) => {
        EventList.state.list.secondItem.updated = dateString.value
      })
  })

  Then(/^I see the list in descending recently updated order$/, async () => {
    client.expect(
      compareDesc(EventList.state.list.firstItem.updated, EventList.state.list.secondItem.updated)
    ).to.be.within(0, 1)
  })

  Then(/^I sort the events list by least recently updated$/, async () => {
    await EventList
      .click('select[name="sortby"] option[value="modified_on:asc"]')
      .wait() // wait for xhr

    await EventList.section.firstEventInList
      .waitForElementVisible('@updated')
      .getText('@updated', (dateString) => {
        EventList.state.list.firstItem.updated = dateString.value
      })

    await EventList.section.secondEventInList
      .waitForElementVisible('@updated')
      .getText('@updated', (dateString) => {
        EventList.state.list.secondItem.updated = dateString.value
      })
  })

  Then(/^I see the list in ascending recently updated order$/, async () => {
    client.expect(
      compareAsc(EventList.state.list.firstItem.updated, EventList.state.list.secondItem.updated)
    ).to.be.within(0, 1)
  })
})
