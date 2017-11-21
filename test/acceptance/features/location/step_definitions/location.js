const { client } = require('nightwatch-cucumber')
const { defineSupportCode } = require('cucumber')

defineSupportCode(({ When, Then }) => {
  const Location = client.page.Location()

  Then(/^I am taken to the "(.+)" page$/, async (text) => {
    await Location
      .section.localHeader
      .waitForElementPresent('@header')
      .assert.containsText('@header', text)
  })

  Then(/^I confirm I am on the (.+) page$/, async (text) => {
    await Location
      .section.localHeader
      .waitForElementPresent('@header')
      .assert.containsText('@header', text)
  })

  Then(/^I wait and then refresh the page$/, async () => {
    await client
      .wait()
      .refresh()
  })
})
