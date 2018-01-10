const { client } = require('nightwatch-cucumber')
const { defineSupportCode } = require('cucumber')
const { get } = require('lodash')

defineSupportCode(({ Given, Then, When }) => {
  const InteractionList = client.page.InteractionList()

  When(/^I filter the interactions list by service provider$/, async function () {
    await InteractionList.section.filters
      .waitForElementPresent('@serviceProvider')
      .clickListOption('dit_team', this.state.interaction.serviceProvider)
      .wait() // wait for xhr
  })

  Then(/^the interactions should be filtered by service provider$/, async function () {
    const selector = '@serviceProvider'
    const expected = get(this.state, `interaction.serviceProvider`)

    await InteractionList
      .section.firstInteractionInList
      .waitForElementVisible(selector)
      .assert.containsText(selector, expected)
  })
})
