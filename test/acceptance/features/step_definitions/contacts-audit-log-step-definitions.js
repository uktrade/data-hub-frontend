const { client } = require('nightwatch-cucumber')
const { defineSupportCode } = require('cucumber')

defineSupportCode(({ Given, Then, When }) => {
  const Company = client.page.Company()

  Given(/^I Amend a existing contact record$/, async () => {
    await Company
      .navigate()
  })

  When(/^I search for this Contact record$/, async () => {
  })

  When(/^I navigate to Audit History tab$/, async () => {
  })

  Then(/^I see the name of the person who made the recent contact record changes$/, async () => {
  })
})
