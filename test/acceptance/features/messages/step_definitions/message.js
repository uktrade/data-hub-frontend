const { client } = require('nightwatch-cucumber')
const { defineSupportCode } = require('cucumber')

defineSupportCode(({ Then }) => {
  const Message = client.page.Message()

  Then(/^I see the success message$/, async () => {
    await Message
      .verifySuccessMessage()
  })

  Then(/^I see the error message$/, async () => {
    await Message
      .waitForElementPresent('@flashMessage')
      .assert.cssClassPresent('@flashMessage', 'c-message--error')
  })
})
