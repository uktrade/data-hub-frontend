const { lowerCase } = require('lodash')

const { client } = require('nightwatch-cucumber')
const { defineSupportCode } = require('cucumber')

defineSupportCode(({ When, Then }) => {
  const Location = client.page.Location()

  Then(/^I click the (.+) local nav link$/, async (navItemText) => {
    const tag = `@${lowerCase(navItemText)}`

    await Location
      .section.detailsTabs
      .waitForElementPresent(tag)
      .assert.containsText(tag, navItemText)
      .click(tag)
  })

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
