const { assign, camelCase, find, get, set } = require('lodash')
const { client } = require('nightwatch-cucumber')
const { When } = require('cucumber')

const fixtures = require('../../fixtures')

When(/^I (?:navigate|go|open|visit).*? `(.+)` page$/, async function (pageName) {
  try {
    const page = get(client.page, pageName)
    await page().navigate()
  } catch (error) {
    throw new Error(`The page object '${pageName}' does not exist`)
  }
})

When(/^I (?:navigate|go|open|visit).*? `(.+)` page using `(.+)` `(.+)` fixture$/, async function (pageName, entity, fixtureName) {
  const Page = get(client.page, pageName)()

  const fixture = find(fixtures[entity], { name: fixtureName })

  // TODO: Need to find a way to remove needing to store the item in state
  const entityTypeFieldName = camelCase(entity)
  set(this.state, entityTypeFieldName, assign({}, get(this.state, entityTypeFieldName), fixture))

  await Page.navigate(Page.url(fixtureName))
})
