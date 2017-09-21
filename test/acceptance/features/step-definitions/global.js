// TODO the name of this file may change as it becomes clear what belongs where
const { client } = require('nightwatch-cucumber')
const { defineSupportCode } = require('cucumber')

defineSupportCode(({ Given, Then, When }) => {
  const Company = client.page.Company()

  Then(/^I see the "(.*)" success message$/, async (successMsg) => {
    await Company
      .assert.containsText('@flashMessage', successMsg)
      .assert.cssClassPresent('@flashMessage', 'c-message--success')
  })
})
