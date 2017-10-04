const { client } = require('nightwatch-cucumber')
const { defineSupportCode } = require('cucumber')

const World = require('../../../common/world')

defineSupportCode(({ Then }) => {
  const Details = client.page.Details()

  // Then

  Then(/^details heading should contain what I entered for "(.+)" field$/, async (fieldName) => {
    await Details
      .assert.containsText('@heading', World.state[fieldName])
  })

  Then(/^details heading should contain "(.+)"$/, async (value) => {
    await Details
      .assert.containsText('@heading', value)
  })

  Then(/^details view data for "(.+)" should contain what I entered for "(.+)" field$/, async (detailsItemName, fieldName) => {
    const detail = await Details.getDetailFor(detailsItemName)

    await Details
      .api.useXpath()
      .assert.containsText(detail.selector, World.state[fieldName])
      .useCss()
  })

  Then(/^details view data for "(.+)" should contain "(.+)"$/, async (detailsItemName, value) => {
    const detail = await Details.getDetailFor(detailsItemName)

    await Details
      .api.useXpath()
      .assert.containsText(detail.selector, value)
      .useCss()
  })
})
