const { client } = require('nightwatch-cucumber')
const { defineSupportCode } = require('cucumber')

defineSupportCode(({ Given, When, Then }) => {
  const InteractionList = client.page.InteractionList()

  Then(/^the interaction list is displayed$/, async function () {
    await InteractionList
      .waitForElementVisible('@heading')
      .assert.containsText('@heading', 'Interactions and services')
  })
})
