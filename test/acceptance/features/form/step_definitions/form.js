const { client } = require('nightwatch-cucumber')
const { defineSupportCode } = require('cucumber')

defineSupportCode(({ Then }) => {
  const Form = client.page.Form()

  Then(/^I see the error summary$/, async () => {
    await Form
      .assert.visible('@errorSummary')
  })
})
