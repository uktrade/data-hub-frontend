const { client } = require('nightwatch-cucumber')
const { defineSupportCode } = require('cucumber')

defineSupportCode(({ Then }) => {
  const Messages = client.page.Messages()

  Then(/^I see the success message$/, async () => {
    await Messages
      .waitForElementPresent('@flashMessage')
      .assert.cssClassPresent('@flashMessage', 'c-message--success')
  })
})
