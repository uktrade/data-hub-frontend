const { client } = require('nightwatch-cucumber')
const { Then } = require('cucumber')

const Interaction = client.page.interactions.Interaction()

Then(/^the interaction details Documents link is displayed$/, async function () {
  await Interaction
    .section.details
    .assert.visible('@documentsLink')
})

Then(/^the interaction details Documents link is not displayed$/, async function () {
  await Interaction
    .section.details
    .assert.elementNotPresent('@documentsLink')
})
