const { compareAsc, compareDesc } = require('date-fns')
const { get, set } = require('lodash')
const { client } = require('nightwatch-cucumber')
const { defineSupportCode } = require('cucumber')

const { getDateFor } = require('../../../helpers/date')

defineSupportCode(({ Then, When }) => {
  const EventList = client.page.EventList()
  const Event = client.page.Event()

  // TODO feels like this can be DRY'd up (see location)
  When(/^I navigate to the event list page$/, async () => {
    await EventList
      .navigate()
      .waitForElementPresent('@h1Element')
  })

  When(/^I populate the create event form$/, async function () {
    await Event
      .populateCreateEventForm({}, true, (event) => {
        set(this.state, 'event', event)
        set(this.state, 'event.heading', get(this.state, 'event.name'))
        set(this.state, 'event.startDate', getDateFor({
          year: get(this.state, 'event.start_date_year'),
          month: get(this.state, 'event.start_date_month'),
          day: get(this.state, 'event.start_date_day'),
        }))
        set(this.state, 'event.endDate', getDateFor({
          year: get(this.state, 'event.end_date_year'),
          month: get(this.state, 'event.end_date_month'),
          day: get(this.state, 'event.end_date_day'),
        }))
      })
  })

  When(/^I populate the create event form with United Kingdom and a region$/, async function () {
    await Event
      .populateCreateEventForm({ address_country: 'United Kingdom' }, true, (event) => {
        set(this.state, 'event', event)
        set(this.state, 'event.heading', event.name)
      })
  })

  When(/^I populate the create event form with United Kingdom and without a region$/, async function () {
    await Event
      .populateCreateEventForm({ address_country: 'United Kingdom' }, false, (event) => {
        set(this.state, 'event', event)
        set(this.state, 'event.heading', event.name)
      })
  })

  Then(/^I can view the event$/, async function () {
    await EventList.section.firstEventInList
      .waitForElementPresent('@header')
      .assert.containsText('@header', this.state.event.name)
      .assert.containsText('@eventType', this.state.event.event_type)
      .assert.containsText('@country', this.state.event.address_country)
      .assert.containsText('@eventStart', getDateFor({
        year: this.state.event.start_date_year,
        month: this.state.event.start_date_month,
        day: this.state.event.start_date_day,
      }))
      .assert.containsText('@eventEnd', getDateFor({
        year: this.state.event.end_date_year,
        month: this.state.event.end_date_month,
        day: this.state.event.end_date_day,
      }))
      .assert.containsText('@organiser', this.state.event.organiser)
      .assert.containsText('@leadTeam', this.state.event.lead_team)
  })

  Then(/^I filter the events list by name$/, async function () {
    await EventList.section.filters
      .waitForElementPresent('@nameInput')
      .setValue('@nameInput', this.state.event.name)
      .sendKeys('@nameInput', [ client.Keys.ENTER ])
      .wait() // wait for xhr

    await EventList.section.firstEventInList
      .waitForElementVisible('@header')
      .assert.containsText('@header', this.state.event.name)

    // clear filter
    await EventList.section.filterTags
      .click('@eventName')
      .wait() // wait for xhr
  })

  Then(/^I filter the events list by organiser$/, async function () {
    await EventList.section.filters
      .waitForElementPresent('@organiser')
      .clickListOption('organiser', this.state.event.organiser)
      .wait() // wait for xhr

    await EventList.section.firstEventInList
      .waitForElementVisible('@organiser')
      .assert.containsText('@organiser', this.state.event.organiser)

    // clear filter
    await EventList.section.filterTags
      .click('@organiser')
      .wait() // wait for xhr
  })

  Then(/^I filter the events list by country/, async function () {
    await EventList.section.filters
      .waitForElementPresent('@country')
      .clickListOption('address_country', this.state.event.address_country)
      .wait() // wait for xhr

    await EventList.section.firstEventInList
      .waitForElementVisible('@country')
      .assert.containsText('@country', this.state.event.address_country)

    // clear filter
    await EventList.section.filterTags
      .click('@country')
      .wait() // wait for xhr
  })

  Then(/^I filter the events list by event type/, async function () {
    await EventList.section.filters
      .waitForElementPresent('@eventType')
      .clickListOption('event_type', this.state.event.event_type)
      .wait() // wait for xhr

    await EventList.section.firstEventInList
      .waitForElementVisible('@eventType')
      .assert.containsText('@eventType', this.state.event.event_type)

    // clear filter
    await EventList.section.filterTags
      .click('@eventType')
      .wait() // wait for xhr
  })

  Then(/^I filter the events list by start date/, async function () {
    const event = this.state.event
    const startDate = getDateFor({
      year: event.start_date_year,
      month: event.start_date_month,
      day: event.start_date_day,
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

  Then(/^I sort the events list name A-Z$/, async function () {
    await EventList
      .click('select[name="sortby"] option[value="name:asc"]')
      .wait()// wait for xhr

    await EventList.section.firstEventInList
      .waitForElementVisible('@header')
      .getText('@header', (text) => {
        set(this.state, 'list.firstItem.heading', text.value)
      })

    await EventList.section.secondEventInList
      .waitForElementVisible('@header')
      .getText('@header', (text) => {
        set(this.state, 'list.secondItem.heading', text.value)
      })
  })

  Then(/^I see the list in A-Z alphabetical order$/, async function () {
    client.expect(
      this.state.list.firstItem.heading.toLowerCase() < this.state.list.secondItem.heading.toLowerCase()
    ).to.be.true
  })

  Then(/^I sort the events list name Z-A$/, async function () {
    await EventList
      .click('select[name="sortby"] option[value="name:desc"]')
      .wait() // wait for xhr

    await EventList.section.firstEventInList
      .waitForElementVisible('@header')
      .getText('@header', (text) => {
        set(this.state, 'list.firstItem.heading', text.value)
      })

    await EventList.section.secondEventInList
      .waitForElementVisible('@header')
      .getText('@header', (text) => {
        set(this.state, 'list.secondItem.heading', text.value)
      })
  })

  Then(/^I see the list in Z-A alphabetical order$/, async function () {
    client.expect(
      this.state.list.firstItem.heading.toLowerCase() > this.state.list.secondItem.heading.toLowerCase()
    ).to.be.true
  })

  Then(/^I sort the events list by recently updated$/, async function () {
    await EventList
      .click('select[name="sortby"] option[value="modified_on:desc"]')
      .wait() // wait for xhr

    await EventList.section.firstEventInList
      .waitForElementVisible('@updated')
      .getText('@updated', (dateString) => {
        set(this.state, 'firstItem.updated ', dateString.value)
      })

    await EventList.section.secondEventInList
      .waitForElementVisible('@updated')
      .getText('@updated', (dateString) => {
        set(this.state, 'list.secondItem.updated', dateString.value)
      })
  })

  Then(/^I see the list in descending recently updated order$/, async function () {
    client.expect(
      compareDesc(this.state.list.firstItem.updated, this.state.list.secondItem.updated)
    ).to.be.within(0, 1)
  })

  Then(/^I sort the events list by least recently updated$/, async function () {
    await EventList
      .click('select[name="sortby"] option[value="modified_on:asc"]')
      .wait() // wait for xhr

    await EventList.section.firstEventInList
      .waitForElementVisible('@updated')
      .getText('@updated', (dateString) => {
        set(this.state, 'list.firstItem.updated', dateString.value)
      })

    await EventList.section.secondEventInList
      .waitForElementVisible('@updated')
      .getText('@updated', (dateString) => {
        set(this.state, 'list.secondItem.updated', dateString.value)
      })
  })

  Then(/^I see the list in ascending recently updated order$/, async function () {
    client.expect(
      compareAsc(this.state.list.firstItem.updated, this.state.list.secondItem.updated)
    ).to.be.within(0, 1)
  })
})
