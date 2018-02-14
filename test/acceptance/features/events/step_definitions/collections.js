const { get, set } = require('lodash')
const { client } = require('nightwatch-cucumber')
const { Then, When } = require('cucumber')
const moment = require('moment')

const { getDateFor } = require('../../../helpers/date')

const EventList = client.page.events.List()
const Event = client.page.events.Event()

When(/^I populate the create event form$/, async function () {
  await Event
    .populateCreateEventForm({}, true, (event) => {
      set(this.state, 'event', event)
      set(this.state, 'event.heading', get(this.state, 'event.name'))
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
  const startDate = getDateFor({
    year: get(this.state, 'event.start_date_year'),
    month: get(this.state, 'event.start_date_month'),
    day: get(this.state, 'event.start_date_day'),
  })

  await EventList.section.firstEventInList
    .waitForElementPresent('@header')
    .assert.containsText('@header', this.state.event.name)
    .assert.containsText('@eventType', this.state.event.event_type)
    .assert.containsText('@country', this.state.event.address_country)
    .assert.containsText('@eventDate', startDate)
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
})

Then(/^I filter the events list by organiser$/, async function () {
  await EventList.section.filters
    .waitForElementPresent('@organiser')
    .clickMultipleChoiceOption('organiser', this.state.event.organiser)
    .wait() // wait for xhr
})

Then(/^I filter the events list by country/, async function () {
  await EventList.section.filters
    .waitForElementPresent('@country')
    .clickMultipleChoiceOption('address_country', this.state.event.address_country)
    .wait() // wait for xhr
})

Then(/^I filter the events list by event type/, async function () {
  await EventList.section.filters
    .waitForElementPresent('@eventType')
    .clickMultipleChoiceOption('event_type', this.state.event.event_type)
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
})

When(/^I sort the events list name A-Z$/, async function () {
  await EventList
    .click('select[name="sortby"] option[value="name:asc"]')
    .wait()// wait for xhr

  await EventList.section.firstEventInList
    .waitForElementVisible('@header')
    .getText('@header', (text) => {
      set(this.state, 'list.firstItem.field', text.value)
    })

  await EventList.section.secondEventInList
    .waitForElementVisible('@header')
    .getText('@header', (text) => {
      set(this.state, 'list.secondItem.field', text.value)
    })
})

When(/^I sort the events list by (least recently|recently) updated$/, async function (sortType) {
  const order = (sortType === 'recently') ? 'modified_on:desc' : 'modified_on:asc'

  await EventList
    .click(`select[name="sortby"] option[value="${order}"]`)
    .wait() // wait for xhr
})

Then(/^the events should be sorted by (least recently|recently) updated$/, async function (sortType) {
  const updateValues = {
    firstItem: null,
    secondItem: null,
  }

  await EventList
    .section.firstEventInList
    .getText('@subHeader', (result) => {
      const date = moment(result.value.substr(11), 'D MMM YYYY, h:mma')
      set(updateValues, 'firstItem', date)
    })

  await EventList
    .section.secondEventInList
    .getText('@subHeader', (result) => {
      const date = moment(result.value.substr(11), 'D MMM YYYY, h:mma')
      set(updateValues, 'secondItem', date)
    })

  if (sortType === 'recently') {
    client.expect(updateValues.firstItem.isSameOrAfter(updateValues.secondItem)).to.be.true
  }

  if (sortType === 'least recently') {
    client.expect(updateValues.firstItem.isSameOrBefore(updateValues.secondItem)).to.be.true
  }
})
