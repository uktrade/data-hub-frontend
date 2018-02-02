const { get } = require('lodash')
const { client } = require('nightwatch-cucumber')
const { When } = require('cucumber')

When(/^I (?:navigate|go|open|visit).*? `(.+)` page$/, async function (pageName) {
  try {
    const page = get(client.page, pageName)
    await page().navigate()
  } catch (error) {
    throw new Error(`The page object '${pageName}' does not exist`)
  }
})
