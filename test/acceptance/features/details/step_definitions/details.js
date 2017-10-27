const { client } = require('nightwatch-cucumber')
const { defineSupportCode } = require('cucumber')

defineSupportCode(({ Then }) => {
  const Details = client.page.Details()

  Then(/^details heading should contain what I entered for "(.+)" field$/, async function (fieldName) {
    await Details
      .assert.containsText('@heading', this.state[fieldName])
  })

  Then(/^details heading should contain "(.+)"$/, async (value) => {
    await Details
      .assert.containsText('@heading', value)
  })

  Then(/^details view data for "(.+)" should contain what I entered for "(.+)" field$/, async function (detailsItemName, fieldName) {
    const detail = await Details.getDetailFor(detailsItemName)

    await Details
      .api.useXpath()
      .assert.containsText(detail.selector, this.state[fieldName])
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
