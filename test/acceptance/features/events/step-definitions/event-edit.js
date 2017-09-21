const { client } = require('nightwatch-cucumber')
const { defineSupportCode } = require('cucumber')

defineSupportCode(({ Given, Then, When }) => {
  const Company = client.page.Company()

  When(/^I navigate to event details page$/, async () => {
    await Company
      .navigate()
  })

  When(/^I click on edit event button$/, async () => {
  })

  When(/^I change event name field to a new value$/, async () => {
  })

  Then(/^I verify the event name is updated with new value$/, async () => {
  })

  When(/^I change event type field to a new value$/, async () => {
  })

  Then(/^I verify the event type is updated with new value$/, async () => {
  })

  When(/^I change event additional reference code field to a new value$/, async () => {
  })

  Then(/^I verify the event additional reference code is updated with new value$/, async () => {
  })

  When(/^I change event dates field to a new value$/, async () => {
  })

  Then(/^I verify the event dates is updated with new value$/, async () => {
  })

  When(/^I change event location type field to a new value$/, async () => {
  })

  Then(/^I verify the event location type is updated with new value$/, async () => {
  })

  When(/^I change event address field to a new value$/, async () => {
  })

  Then(/^I verify the event address is updated with new value$/, async () => {
  })

  When(/^I change event notes field to a new value$/, async () => {
  })

  Then(/^I verify the event notes is updated with new value$/, async () => {
  })

  When(/^I change event team hosting field to a new value$/, async () => {
  })

  Then(/^I verify the event team hosting is updated with new value$/, async () => {
  })

  When(/^I change event organiser field to a new value$/, async () => {
  })

  Then(/^I verify the event organiser is updated with new value$/, async () => {
  })

  When(/^I change event shared teams field to a new value$/, async () => {
  })

  Then(/^I verify the event shared teams is updated with new value$/, async () => {
  })

  When(/^I change event related programmes field to a new value$/, async () => {
  })

  Then(/^I verify the event related programmes is updated with new value$/, async () => {
  })
})
