const { format } = require('date-fns')
const { client } = require('nightwatch-cucumber')
const { defineSupportCode } = require('cucumber')

defineSupportCode(({ Then, When, Before }) => {
  const EventsList = client.page.EventsList()
  const Events = client.page.Events()

  Before(() => {
    Events.state = {
      eventDetails: {},
    }
    EventsList.state = {
      listHeaders: {},
    }
  })

  When(/^I navigate to the event list page$/, async () => {
    await EventsList
      .navigate()
      .waitForElementPresent('@h1Element')
  })

  When(/^I click the add an event link$/, async () => {
    await EventsList
      .assert.elementPresent('@addEventButton')
      .click('@addEventButton')
  })

  When(/^I populate the create event form$/, async () => {
    await Events
      .populateCreateEventForm()
  })

  Then(/^I am taken to the create event page$/, async () => {
    await EventsList
      .waitForElementPresent('@h1Element')
      .assert.urlEquals(`${EventsList.url}/create`)
  })

  Then(/^I can view the event$/, async () => {
    await EventsList.section.firstEventInList
      .waitForElementPresent('@header')
      .assert.containsText('@header', Events.state.eventDetails.name)
      .assert.containsText('@eventType', Events.state.eventDetails.event_type)
      .assert.containsText('@country', Events.state.eventDetails.address_country)
      .assert.containsText('@eventStart', format(
        new Date(
          Events.state.eventDetails.start_date_year,
          Events.state.eventDetails.start_date_month - 1,
          Events.state.eventDetails.start_date_day
        ),
        'D MMMM YYYY'))
      .assert.containsText('@eventEnd', format(
        new Date(
          Events.state.eventDetails.end_date_year,
          Events.state.eventDetails.end_date_month - 1,
          Events.state.eventDetails.end_date_day
        ),
        'D MMMM YYYY'
      ))
      .assert.containsText('@organiser', Events.state.eventDetails.organiser)
      .assert.containsText('@leadTeam', Events.state.eventDetails.lead_team)
  })

  Then(/^I filter the events list$/, async () => {
    await EventsList.section.filters
      .waitForElementPresent('@nameInput')
      .setValue('@nameInput', Events.state.eventDetails.name)
      .sendKeys('@nameInput', [ client.Keys.ENTER ])

    client.pause(2000) // wait for xhr

    await EventsList.section.firstEventInList
      .waitForElementVisible('@header')
      .assert.containsText('@header', Events.state.eventDetails.name)
  })

  Then(/^I sort the events list name A-Z$/, async () => {
    await EventsList
      .click('select[name="sortby"] option[value="name:asc"]')

    client.pause(2000) // wait for xhr

    await EventsList
      .waitForElementVisible('@firstHeaderInList')
      .getText('@firstHeaderInList', (firstHeaderText) => {
        EventsList.state.listHeaders.first = firstHeaderText
      })
      .waitForElementVisible('@secondHeaderInList')
      .getText('@secondHeaderInList', (secondHeaderText) => {
        EventsList.state.listHeaders.second = secondHeaderText
      })
  })

  Then(/^I see the list in A-Z alphabetical order$/, async () => {
    client.expect(
      EventsList.state.listHeaders.first.value < EventsList.state.listHeaders.second.value
    ).to.be.true
  })

  Then(/^I sort the events list name Z-A$/, async () => {
    await EventsList
      .click('select[name="sortby"] option[value="name:desc"]')

    client.pause(2000) // wait for xhr

    await EventsList
      .waitForElementVisible('@firstHeaderInList')
      .getText('@firstHeaderInList', (firstHeaderText) => {
        EventsList.state.listHeaders.first = firstHeaderText
      })
      .waitForElementVisible('@secondHeaderInList')
      .getText('@secondHeaderInList', (secondHeaderText) => {
        EventsList.state.listHeaders.second = secondHeaderText
      })
  })

  Then(/^I see the list in Z-A alphabetical order$/, async () => {
    client.expect(
      EventsList.state.listHeaders.first.value > EventsList.state.listHeaders.second.value
    ).to.be.true
  })
})
