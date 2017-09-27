const { format } = require('date-fns')
const { client } = require('nightwatch-cucumber')
const { defineSupportCode } = require('cucumber')

defineSupportCode(({ Then, When, Before }) => {
  const EventList = client.page.EventList()
  const Event = client.page.Event()

  Before(() => {
    Event.state = {
      eventDetails: {},
    }
    EventList.state = {
      listHeaders: {},
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
      .assert.containsText('@eventStart', format(
        new Date(
          Event.state.eventDetails.start_date_year,
          Event.state.eventDetails.start_date_month - 1,
          Event.state.eventDetails.start_date_day
        ),
        'D MMMM YYYY'))
      .assert.containsText('@eventEnd', format(
        new Date(
          Event.state.eventDetails.end_date_year,
          Event.state.eventDetails.end_date_month - 1,
          Event.state.eventDetails.end_date_day
        ),
        'D MMMM YYYY'
      ))
      .assert.containsText('@organiser', Event.state.eventDetails.organiser)
      .assert.containsText('@leadTeam', Event.state.eventDetails.lead_team)
  })

  Then(/^I filter the events list$/, async () => {
    await EventList.section.filters
      .waitForElementPresent('@nameInput')
      .setValue('@nameInput', Event.state.eventDetails.name)
      .sendKeys('@nameInput', [ client.Keys.ENTER ])
      .wait() // wait for xhr

    await EventList.section.firstEventInList
      .waitForElementVisible('@header')
      .assert.containsText('@header', Event.state.eventDetails.name)
  })

  Then(/^I sort the events list name A-Z$/, async () => {
    await EventList
      .click('select[name="sortby"] option[value="name:asc"]')
      .wait()// wait for xhr

    await EventList
      .waitForElementVisible('@firstHeaderInList')
      .getText('@firstHeaderInList', (firstHeaderText) => {
        EventList.state.listHeaders.first = firstHeaderText
      })
      .waitForElementVisible('@secondHeaderInList')
      .getText('@secondHeaderInList', (secondHeaderText) => {
        EventList.state.listHeaders.second = secondHeaderText
      })
  })

  Then(/^I see the list in A-Z alphabetical order$/, async () => {
    client.expect(
      EventList.state.listHeaders.first.value < EventList.state.listHeaders.second.value
    ).to.be.true
  })

  Then(/^I sort the events list name Z-A$/, async () => {
    await EventList
      .click('select[name="sortby"] option[value="name:desc"]')
      .wait() // wait for xhr

    await EventList
      .waitForElementVisible('@firstHeaderInList')
      .getText('@firstHeaderInList', (firstHeaderText) => {
        EventList.state.listHeaders.first = firstHeaderText
      })
      .waitForElementVisible('@secondHeaderInList')
      .getText('@secondHeaderInList', (secondHeaderText) => {
        EventList.state.listHeaders.second = secondHeaderText
      })
  })

  Then(/^I see the list in Z-A alphabetical order$/, async () => {
    client.expect(
      EventList.state.listHeaders.first.value > EventList.state.listHeaders.second.value
    ).to.be.true
  })
})
