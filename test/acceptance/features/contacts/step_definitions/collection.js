const { client } = require('nightwatch-cucumber')
const { defineSupportCode } = require('cucumber')

defineSupportCode(({ Given, Then, When }) => {
  const Contact = client.page.Contact()

  When(/^I click on the first contact collection link$/, async () => {
    await Contact
      .click('@firstCompanyFromList')
  })
})
