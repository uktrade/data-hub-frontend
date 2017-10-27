const { client } = require('nightwatch-cucumber')
const { defineSupportCode } = require('cucumber')

defineSupportCode(({ Then }) => {
  const Message = client.page.Message()

  Then(/^I see the (success|error) message$/, async (messageType) => {
    await Message
      .verifyMessage(messageType)
  })
})
