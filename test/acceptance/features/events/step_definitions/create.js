const { set } = require('lodash')
const { client } = require('nightwatch-cucumber')
const { defineSupportCode } = require('cucumber')

defineSupportCode(function ({ Given, Then, When }) {
  const Event = client.page.Event()

  When(/^I create an event$/, async function () {
    await Event
      .navigate()
      .populateCreateEventForm({}, true, (event) => set(this.state, 'event', event))
      .click('@saveButton')
      .wait() // wait for backend to sync
  })

  Given(/^I navigate to the create an event page$/, async () => {
    await Event
      .navigate()
  })

  When(/^I choose the (.+) country option$/, async (country) => {
    await Event
      .setValue('@addressCountry', '')
      .clickListOption('address_country', country)
  })

  Then(/^I verify the event name field is displayed$/, async () => {
    await Event
      .assert.visible('@eventName')
  })

  Then(/^I verify the event type field is displayed$/, async () => {
    await Event
      .assert.visible('@eventType')
  })

  Then(/^I verify the event additional reference code field is displayed$/, async () => {
    await Event
      .assert.visible('@additionalRefCode')
  })

  Then(/^I verify the event start date fields are displayed$/, async () => {
    await Event
      .assert.visible('@startDateYear')
    await Event
      .assert.visible('@startDateMonth')
    await Event
      .assert.visible('@startDateDay')
  })

  Then(/^I verify the event end date fields are displayed$/, async () => {
    await Event
      .assert.visible('@endDateYear')
    await Event
      .assert.visible('@endDateMonth')
    await Event
      .assert.visible('@endDateDay')
  })

  Then(/^I verify the event location type field is displayed$/, async () => {
    await Event
      .assert.visible('@locationType')
  })

  Then(/^I verify the event address line1 field is displayed$/, async () => {
    await Event
      .assert.visible('@addressLine1')
  })

  Then(/^I verify the event address line2 field is displayed$/, async () => {
    await Event
      .assert.visible('@addressLine2')
  })

  Then(/^I verify the event address town field is displayed$/, async () => {
    await Event
      .assert.visible('@addressTown')
  })

  Then(/^I verify the event address county field is displayed$/, async () => {
    await Event
      .assert.visible('@addressCounty')
  })

  Then(/^I verify the event address postcode field is displayed$/, async () => {
    await Event
      .assert.visible('@addressPostcode')
  })

  Then(/^I verify the event address country field is displayed$/, async () => {
    await Event
      .assert.visible('@addressCountry')
  })

  Then(/^I verify the event UK region field is displayed$/, async () => {
    await Event
      .assert.visible('@ukRegion')
  })

  Then(/^I verify the event UK region field is not displayed$/, async () => {
    await Event
      .assert.hidden('@ukRegion')
  })

  Then(/^I verify the event notes field is displayed$/, async () => {
    await Event
      .assert.visible('@notes')
  })

  Then(/^I verify the event Team hosting field is displayed$/, async () => {
    await Event
      .assert.visible('@leadTeam')
  })

  Then(/^I verify the event services field is displayed$/, async () => {
    await Event
      .assert.visible('@service')
  })

  Then(/^I verify the event organiser field is displayed$/, async () => {
    await Event
      .assert.visible('@organiser')
  })

  Then(/^I verify the event is shared or not field is displayed$/, async () => {
    await Event
      .assert.visible('@sharedYes')
      .assert.visible('@sharedNo')
  })

  When(/^I choose the Yes option$/, async () => {
    await Event
      .setValue('@sharedYes', '')
      .click('@sharedYes')
  })

  When(/^I choose the No option$/, async () => {
    await Event
      .setValue('@sharedNo', '')
      .click('@sharedNo')
  })

  Then(/^I verify the shared teams field is displayed$/, async () => {
    await Event
      .assert.visible('@teams')
  })

  Then(/^I verify the shared teams field is not displayed$/, async () => {
    await Event
      .assert.hidden('@teams')
  })

  When(/^I select shared team ([0-9])$/, async (optionNumber) => {
    await Event
      .setValue('@teams', '')
      .selectListOption('teams', optionNumber)
  })

  When(/^I add it to the shared teams list$/, async () => {
    await Event
      .click('@addAnotherSharedTeam')
  })

  Then(/^I verify there should be ([0-9]) shared teams lists$/, async (expected) => {
    await Event
      .assertVisibleTeamsList(expected)
  })

  Then(/^I verify there is the option to add another shared team$/, async () => {
    await Event
      .assert.visible('@addAnotherSharedTeam')
  })

  Then(/^I verify the event related programmes field is displayed$/, async () => {
    await Event
      .assert.visible('@relatedProgrammes')
  })

  When(/^I select programme ([0-9])$/, async (optionNumber) => {
    await Event
      .setValue('@teams', '')
      .selectListOption('related_programmes', optionNumber)
  })

  When(/^I add it to the programmes list$/, async () => {
    await Event
      .click('@addAnotherProgramme')
  })

  Then(/^I verify there should be ([0-9]) programmes lists$/, async (expected) => {
    await Event
      .assertVisibleRelatedProgrammesList(expected)
  })

  Then(/^I verify there is the option to add another programme/, async () => {
    await Event
      .assert.visible('@addAnotherProgramme')
  })

  Then(/^I verify the event save button is displayed$/, async () => {
    await Event
      .assert.visible('@saveButton')
  })

  Then(/^I verify the event name has an error message$/, async () => {
    await Event
      .assert.visible('@eventNameError')
  })

  Then(/^I click the save button$/, async () => {
    await Event
      .click('@saveButton')
      .wait() // wait for backend to sync
  })

  Then(/^the event fields have error messages$/, async () => {
    await Event
      .assert.visible('@nameError')
      .assert.visible('@typeError')
      .assert.visible('@startDateError')
      .assert.visible('@endDateError')
      .assert.visible('@addressLine1Error')
      .assert.visible('@addressTownError')
      .assert.visible('@addressCountryError')
      .assert.visible('@serviceError')
  })

  Then(/^I verify the event UK region has an error message$/, async () => {
    await Event
      .assert.visible('@ukRegionError')
  })

  Then(/^I see the event is displayed correctly with all field values$/, async () => {
    await Event
      .assert.containsText('@eventNameFromDetails', '')
      .assert.containsText('@eventTypeFromDetails', '')
      .assert.containsText('@addressLine1FromDetails', '')
      .assert.containsText('@addressTownFromDetails', '')
      .assert.containsText('@addressCountryFromDetails', '')
  })
})
