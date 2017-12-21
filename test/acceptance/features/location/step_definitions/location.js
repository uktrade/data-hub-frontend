const { find, assign, set, get, camelCase } = require('lodash')
const { client } = require('nightwatch-cucumber')
const { defineSupportCode } = require('cucumber')

defineSupportCode(({ Given, Then }) => {
  const Location = client.page.Location()
  const Search = client.page.Search()

  Given(/^I navigate to (.+) fixture (.+)$/, async function (entityType, fixtureName) {
    const entityTypeFieldName = camelCase(entityType)
    const fixtureDetails = find(this.fixtures[entityTypeFieldName], ['name', fixtureName])
    set(this.state, entityTypeFieldName, assign({}, get(this.state, entityTypeFieldName), fixtureDetails))

    await Search
      .navigate()
      .search(fixtureName)

    await Search
      .section.tabs
      .waitForElementPresent(`@${entityTypeFieldName}`)
      .click(`@${entityTypeFieldName}`)

    await Search
      .section.firstSearchResult
      .waitForElementPresent('@header')
      .click('@header')

    await Location
      .section.localHeader
      .waitForElementPresent('@header')
      .assert.containsText('@header', fixtureName)
  })

  Then(/^I click the (.+) local nav link$/, async (localNavLinkText) => {
    const localNavLinkSelector = Location.section.localNav.getLocalNavLinkSelector(localNavLinkText)

    await Location.section.localNav
      .api.useXpath()
      .waitForElementVisible(localNavLinkSelector.selector)
      .click(localNavLinkSelector.selector)
      .useCss()
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
