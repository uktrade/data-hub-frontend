const { client } = require('nightwatch-cucumber')
const { defineSupportCode } = require('cucumber')

defineSupportCode(({ When, Then }) => {
  const Form = client.page.Form()

  When(/^I submit the form$/, async () => {
    await Form
      .submitForm('form')
  })

  Then(/^I see the error summary$/, async () => {
    await Form
      .assert.visible('@errorSummary')
  })
})
