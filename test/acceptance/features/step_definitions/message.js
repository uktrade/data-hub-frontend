const { client } = require('nightwatch-cucumber')
const { Then } = require('cucumber')

const Message = client.page.message()

Then(/^I see the (success|error) message$/, async (messageType) => {
  await Message
    .verifyMessage(messageType)
})
