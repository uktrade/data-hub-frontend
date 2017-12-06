const { lowerCase, get, camelCase } = require('lodash')
const { client } = require('nightwatch-cucumber')
const { defineSupportCode } = require('cucumber')

const dashboardPage = `${process.env.QA_HOST}/`

defineSupportCode(({ When, Then }) => {
  const Location = client.page.Location()
  const Search = client.page.Search()

  When(/^I navigate to the (.+) "(.+)" tab/, async function (entityName, localNavLinkText) {
    await client
      .url(dashboardPage)

    await Search
      .search(get(this.state, `${entityName}.uniqueSearchTerm`))

    const searchTabSelector = `@${camelCase(entityName)}`

    await Search.section.tabs
      .waitForElementVisible(searchTabSelector)
      .click(searchTabSelector)

    await Search
      .section.firstSearchResult
      .click('@header')

    const localNavLinkSelector = Location.section.localNav.getLocalNavLinkSelector(localNavLinkText)

    await Location.section.localNav
      .api.useXpath()
      .waitForElementVisible(localNavLinkSelector.selector)
      .click(localNavLinkSelector.selector)
      .useCss()
  })

  Then(/^I click the (.+) local nav link$/, async (navItemText) => {
    const tag = `@${lowerCase(navItemText)}`

    await Location
      .section.localNav
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
