const { client } = require('nightwatch-cucumber')
const { defineSupportCode } = require('cucumber')

defineSupportCode(({ When, Then }) => {
  const Form = client.page.Form()

  When(/^I submit (.+) form$/, async (selector) => {
    selector = selector === 'the' ? 'form' : selector

    await Form
      .submitForm(selector)
  })

  Then(/^I see form error summary$/, async () => {
    await Form
      .assert.visible('@errorSummary')
  })
})
