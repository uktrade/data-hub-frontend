const faker = require('faker')
const { client } = require('nightwatch-cucumber')
const { defineSupportCode } = require('cucumber')

defineSupportCode(({ Given, Then, When }) => {
  const Company = client.page.Company()
  const events = client.page.Events()

  When(/^I navigate to create an event page$/, async () => {
    await Company
      .navigate()
  })

  Then(/^I verify the event name field is displayed$/, async () => {
    await events
      .verify.visible('@eventName')
  })

  Then(/^I verify the event type field is displayed$/, async () => {
    await events
      .verify.visible('@eventType')
  })

  Then(/^I verify the event additional reference code field is displayed$/, async () => {
    await events
      .verify.visible('@additionalRefCode')
  })

  Then(/^I verify the event start date field is displayed$/, async () => {
    await events
      .verify.visible('@startDate')
  })

  Then(/^I verify the event end date field is displayed$/, async () => {
    await events
      .verify.visible('@end Date')
  })

  Then(/^I verify the event location type field is displayed$/, async () => {
    await events
      .verify.visible('@locationType')
  })

  Then(/^I verify the event address line1 field is displayed$/, async () => {
    await events
      .verify.visible('@addressLine1')
  })

  Then(/^I verify the event address line2 field is displayed$/, async () => {
    await events
      .verify.visible('@addressLine2')
  })

  Then(/^I verify the event address town field is displayed$/, async () => {
    await events
      .verify.visible('@addressTown')
  })

  Then(/^I verify the event address postcode field is displayed$/, async () => {
    await events
      .verify.visible('@addressPostcode')
  })

  Then(/^I verify the event address country field is displayed$/, async () => {
    await events
      .verify.visible('@addressCountry')
  })

  Then(/^I verify the event notes field is displayed$/, async () => {
    await events
      .verify.visible('@notes')
  })

  Then(/^I verify the event Team hosting field is displayed$/, async () => {
    await events
      .verify.visible('@teamHosting')
  })

  Then(/^I verify the event organiser field is displayed$/, async () => {
    await events
      .verify.visible('@organiser')
  })

  Then(/^I verify the event is shared or not field is displayed$/, async () => {
    await events
      .verify.visible('@sharedYes')
      .verify.visible('@sharedNo')
  })

  When(/^I choose Yes option$/, async () => {
    await events
      .click('@sharedYes')
  })

  Then(/^I verify the shared teams field is displayed$/, async () => {
    await events
      .verify.visible('@sharedTeams')
  })

  When(/^I select a shared team name$/, async () => {
    await events
      .click('@sharedTeamsList')
  })

  When(/^I add it to the list$/, async () => {
    await events
      .click('@addTeamToList')
  })

  Then(/^I verify there is option to add another team$/, async () => {
    await events
      .verify.visible('@addAnotherTeam')
  })

  Then(/^I verify the event related programmes field is displayed$/, async () => {
    await events
      .verify.visible('@relatedProgrammes')
  })

  When(/^I select a related programme name$/, async () => {
    await events
      .click('@relatedProgrammesList')
  })

  Then(/^I verify there is option to add another programme name$/, async () => {
    await events
      .click('@addAnotherProgrammes')
  })

  Then(/^I verify the event save button is displayed$/, async () => {
    await events
      .verify.visible('@saveButton')
  })

  When(/^I enter all mandatory fields related to the event$/, async () => {
    await events
      .setValue('@eventName', faker.company.companyName())
      .click('@eventTypeList')
      .setValue('@addressLine1', faker.address.streetName())
      .setValue('@addressTown', faker.address.city())
      .setValue('@addressPostcode', faker.address.zipCode())
      .setValue('@addressCountry', faker.address.country())
  })

  Then(/^I verify error message displayed for event name field$/, async () => {
    await events
      .verify.visible('@errorEventName')
  })

  Then(/^I verify error message displayed for event type field$/, async () => {
    await events
      .verify.visible('@errorEventType')
  })

  Then(/^I verify error message displayed for Address fields$/, async () => {
    await events
      .verify.visible('@errorAddressLine1')
      .verify.visible('@errorAddressTown')
      .verify.visible('@errorAddressPostcode')
      .verify.visible('@errorAddressCountry')
  })

  Then(/^I see the Added new event confirmation message is not displayed$/, async () => {
    await Company
      .assert.elementNotVisible('@flashInfo')
  })

  Then(/^I see the event is displayed correctly with all field values$/, async () => {
    await events
      .assert.containsText('@eventNameFromDetails', '')
      .assert.containsText('@eventTypeFromDetails', '')
      .assert.containsText('@addressLine1FromDetails', '')
      .assert.containsText('@addressTownFromDetails', '')
      .assert.containsText('@addressCountryFromDetails', '')
  })
})
