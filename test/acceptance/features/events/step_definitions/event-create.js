const faker = require('faker')
const { client } = require('nightwatch-cucumber')
const { defineSupportCode } = require('cucumber')

defineSupportCode(({ Given, Then, When }) => {
  const Events = client.page.Events()

  When(/^I navigate to the create an event page$/, async () => {
    await Events
      .navigate()
  })

  When(/^I choose the (.+) country option$/, async (country) => {
    await Events
      .setValue('@addressCountry', '')
      .selectListOptionByText('address_country', country)
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

  Then(/^I verify the event UK region field is displayed$/, async () => {
    await Events
      .assert.visible('@ukRegion')
  })

  Then(/^I verify the event UK region field is not displayed$/, async () => {
    await Events
      .assert.hidden('@ukRegion')
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
      .selectListOption('teams', optionNumber)
  })

  When(/^I add it to the shared teams list$/, async () => {
    await Events
      .click('@addAnotherSharedTeam')
  })

  Then(/^I verify there should be ([0-9]) shared teams lists$/, async (expected) => {
    await Events
      .assertVisibleTeamsList(expected)
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
      .selectListOption('related_programmes', optionNumber)
  })

  When(/^I add it to the programmes list$/, async () => {
    await Events
      .click('@addAnotherProgramme')
  })

  When(/^I enter all mandatory fields related to the event$/, async () => {
    await Events
      .setValue('@eventName', faker.company.companyName())
      .selectListOption('event_type', 2)
      .setValue('@addressLine1', faker.address.streetName())
      .setValue('@addressTown', faker.address.city())
      .setValue('@addressPostcode', faker.address.zipCode())
      .setValue('@addressCountry', faker.address.country())
  })

  When(/^I click the save button$/, async () => {
    await Events.submitForm('form')
  })

  Then(/^I verify there should be ([0-9]) programmes lists$/, async (expected) => {
    await Events
      .assertVisibleRelatedProgrammesList(expected)
  })

  Then(/^I verify there is the option to add another programme/, async () => {
    await Events
      .assert.visible('@addAnotherProgramme')
  })

  Then(/^I verify the event save button is displayed$/, async () => {
    await Events
      .assert.visible('@saveButton')
  })

  Then(/^I verify the event name has an error message$/, async () => {
    await Events
      .assert.visible('@eventNameError')
  })

  Then(/^I verify the event type has an error message$/, async () => {
    await Events
      .assert.visible('@eventTypeError')
  })

  Then(/^I verify the event address line 1 has an error message$/, async () => {
    await Events
      .assert.visible('@addressLine1Error')
  })

  Then(/^I verify the event address town has an error message$/, async () => {
    await Events
      .assert.visible('@addressTownError')
  })

  Then(/^I verify the event address country has an error message$/, async () => {
    await Events
      .assert.visible('@addressCountryError')
  })

  Then(/^I verify the event UK region has an error message$/, async () => {
    await Events
      .assert.visible('@ukRegionError')
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
