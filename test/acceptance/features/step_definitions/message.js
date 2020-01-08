const { client } = require('nightwatch-cucumber')
const { Then } = require('cucumber')

const Message = client.page.message()

Then(
  /^I see (the|an) (success|error|info) message$/,
  async (thean, messageType) => {
    await Message.verifyMessage(messageType)
  }
)

Then(
  /^I see (the|an) (success|error|info) message containing "(.+)"$/,
  async (thean, messageType, message) => {
    await Message.verifyMessage(messageType, message)
  }
)
