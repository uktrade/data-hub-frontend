const faker = require('faker')
const { client } = require('nightwatch-cucumber')
const { defineSupportCode } = require('cucumber')

defineSupportCode(({ Given, Then, When }) => {
  const Company = client.page.Company()
  const Events = client.page.Events()

  When(/^I navigate to create an event page$/, async () => {
    await Events
      .navigate()
  })

  Then(/^I verify the event name field is displayed$/, async () => {
    await Events
      .assert.visible('@eventName')
  })

  Then(/^I verify the event type field is displayed$/, async () => {
    await Events
      .assert.visible('@eventType')
  })

  Then(/^I verify the event additional reference code field is displayed$/, async () => {
    await Events
      .assert.visible('@additionalRefCode')
  })

  Then(/^I verify the event start date fields are displayed$/, async () => {
    await Events
      .assert.visible('@startDateYear')
    await Events
      .assert.visible('@startDateMonth')
    await Events
      .assert.visible('@startDateDay')
  })

  Then(/^I verify the event end date fields are displayed$/, async () => {
    await Events
      .assert.visible('@endDateYear')
    await Events
      .assert.visible('@endDateMonth')
    await Events
      .assert.visible('@endDateDay')
  })

  Then(/^I verify the event location type field is displayed$/, async () => {
    await Events
      .assert.visible('@locationType')
  })

  Then(/^I verify the event address line1 field is displayed$/, async () => {
    await Events
      .assert.visible('@addressLine1')
  })

  Then(/^I verify the event address line2 field is displayed$/, async () => {
    await Events
      .assert.visible('@addressLine2')
  })

  Then(/^I verify the event address town field is displayed$/, async () => {
    await Events
      .assert.visible('@addressTown')
  })

  Then(/^I verify the event address county field is displayed$/, async () => {
    await Events
      .assert.visible('@addressCounty')
  })

  Then(/^I verify the event address postcode field is displayed$/, async () => {
    await Events
      .assert.visible('@addressPostcode')
  })

  Then(/^I verify the event address country field is displayed$/, async () => {
    await Events
      .assert.visible('@addressCountry')
  })

  Then(/^I verify the event notes field is displayed$/, async () => {
    await Events
      .assert.visible('@notes')
  })

  Then(/^I verify the event Team hosting field is displayed$/, async () => {
    await Events
      .assert.visible('@teamHosting')
  })

  Then(/^I verify the event organiser field is displayed$/, async () => {
    await Events
      .assert.visible('@organiser')
  })

  Then(/^I verify the event is shared or not field is displayed$/, async () => {
    await Events
      // .waitForElementVisible('@sharedYes', 1000)
      .assert.visible('@sharedYes')
      .assert.visible('@sharedNo')
  })

  When(/^I choose the Yes option$/, async () => {
    await Events
      .setValue('@sharedYes', '')
      .click('@sharedYes')
  })

  When(/^I choose the No option$/, async () => {
    await Events
      .setValue('@sharedNo', '')
      .click('@sharedNo')
  })

  Then(/^I verify the shared teams field is displayed$/, async () => {
    await Events
      .assert.visible('@sharedTeams')
  })

  Then(/^I verify the shared teams field is not displayed$/, async () => {
    await Events
      .assert.hidden('@sharedTeams')
  })

  When(/^I select shared team ([0-9])$/, async (optionNumber) => {
    await Events
      .setValue('@sharedTeams', '')
      .selectTeam(optionNumber)
  })

  When(/^I add it to the shared teams list$/, async () => {
    await Events
      .click('@addAnotherSharedTeam')
  })

  Then(/^I verify there should be ([0-9]) shared teams lists$/, async (expected) => {
    await Events
      .assertVisibleSharedTeamList(expected)
  })

  Then(/^I verify there is the option to add another shared team$/, async () => {
    await Events
      .assert.visible('@addAnotherSharedTeam')
  })

  Then(/^I verify the event related programmes field is displayed$/, async () => {
    await Events
      .assert.visible('@relatedProgrammes')
  })

  When(/^I select programme ([0-9])$/, async (optionNumber) => {
    await Events
      .setValue('@sharedTeams', '')
      .selectRelatedProgramme(optionNumber)
  })

  When(/^I add it to the programmes list$/, async () => {
    await Events
      .click('@addAnotherProgramme')
  })

  Then(/^I verify there should be ([0-9]) programmes lists$/, async (expected) => {
    await Events
      .assertVisibleProgrammesList(expected)
  })

  Then(/^I verify there is the option to add another programme/, async () => {
    await Events
      .assert.visible('@addAnotherProgramme')
  })

  Then(/^I verify the event save button is displayed$/, async () => {
    await Events
      .assert.visible('@saveButton')
  })

  When(/^I enter all mandatory fields related to the event$/, async () => {
    await Events
      .setValue('@eventName', faker.company.companyName())
      .click('@eventTypeList')
      .setValue('@addressLine1', faker.address.streetName())
      .setValue('@addressTown', faker.address.city())
      .setValue('@addressPostcode', faker.address.zipCode())
      .setValue('@addressCountry', faker.address.country())
  })

  Then(/^I verify error message displayed for event name field$/, async () => {
    await Events
      .assert.visible('@errorEventName')
  })

  Then(/^I verify error message displayed for event type field$/, async () => {
    await Events
      .assert.visible('@errorEventType')
  })

  Then(/^I verify error message displayed for Address fields$/, async () => {
    await Events
      .assert.visible('@errorAddressLine1')
      .assert.visible('@errorAddressTown')
      .assert.visible('@errorAddressPostcode')
      .assert.visible('@errorAddressCountry')
  })

  Then(/^I see the Added new event confirmation message is not displayed$/, async () => {
    await Company
      .assert.elementNotVisible('@flashInfo')
  })

  Then(/^I see the event is displayed correctly with all field values$/, async () => {
    await Events
      .assert.containsText('@eventNameFromDetails', '')
      .assert.containsText('@eventTypeFromDetails', '')
      .assert.containsText('@addressLine1FromDetails', '')
      .assert.containsText('@addressTownFromDetails', '')
      .assert.containsText('@addressCountryFromDetails', '')
  })
})
