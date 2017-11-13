const { client } = require('nightwatch-cucumber')
const { defineSupportCode } = require('cucumber')
const { get, camelCase } = require('lodash')

defineSupportCode(({ Given, Then, When }) => {
  const InteractionList = client.page.InteractionList()

  Then(/^I can view the (.+) in the collection for interactions and services$/, async function (entityType, dataTable) {
    const entityHeader = get(this.state, `${camelCase(entityType)}.header`)

    for (let row of dataTable.hashes()) {
      const selector = InteractionList.getXPathSelectorForEntityMetaListItem(entityHeader, row.label)
      const expectedText = get(this.state, row.statePath)

      if (expectedText) {
        await InteractionList
          .api.useXpath()
          .assert.containsText(selector, expectedText)
          .useCss()
      } else {
        if (row.statePath) {
          InteractionList
            .assert.fail(`Invalid statePath for ${row.label}`)
        }

        await InteractionList
          .api.useXpath()
          .assert.visible(selector)
          .useCss()
      }
    }
  })

  Then(/^the (.+) has badges for interactions and services$/, async function (entityType, dataTable) {
    const entityHeader = get(this.state, `${camelCase(entityType)}.header`)

    for (let row of dataTable.hashes()) {
      const selector = InteractionList.getXPathSelectorForEntityBadgeWithText(entityHeader, row.text)

      await InteractionList
        .api.useXpath()
        .assert.visible(selector)
        .useCss()
    }
  })
})
