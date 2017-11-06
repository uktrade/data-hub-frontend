const { get, camelCase } = require('lodash')
const { client } = require('nightwatch-cucumber')
const { defineSupportCode } = require('cucumber')

defineSupportCode(({ When, Then }) => {
  const Collection = client.page.Collection()

  When(/^I navigate to the (.+) collection page$/, async function (collectionType) {
    const url = this.urls[camelCase(collectionType)].collection

    await client
      .url(url)
  })

  When(/^I click the "(.+)" link$/, async (linkTextContent) => {
    await Collection
      .section.collectionHeader
      .waitForElementPresent('@addLink')
      .assert.containsText('@addLink', linkTextContent)
      .click('@addLink')
  })

  Then(/^there are (.+) headings$/, async function (collectionType) {
    await Collection
      .section.localHeader
      .waitForElementPresent('@header')
      .assert.containsText('@header', collectionType)

    const resultsCountHeaderSelector = Collection.getSelectorForResultsCountHeader(collectionType)

    await Collection
      .api.useXpath()
      .assert.visible(resultsCountHeaderSelector.selector)
      .useCss()
  })

  Then(/^I can view the (.+) in the collection$/, async function (entityType, dataTable) {
    const entityHeaderName = get(this.state, `${camelCase(entityType)}.header`)

    await Collection
      .section.firstCollectionItem
      .waitForElementPresent('@header')
      .assert.containsText('@header', entityHeaderName)

    for (let row of dataTable.hashes()) {
      const element = Collection.getSelectorForMetaListItem(row.label)
      const expectedText = get(this.state, row.statePath)

      if (expectedText) {
        await Collection
          .section.firstCollectionItem
          .api.useXpath()
          .assert.containsText(element.selector, expectedText)
          .useCss()
      } else {
        if (row.statePath) {
          Collection
            .assert.fail(`Invalid statePath for ${row.label}`)
        }

        await Collection
          .section.firstCollectionItem
          .api.useXpath()
          .assert.visible(element.selector)
          .useCss()
      }
    }
  })

  Then(/^the (.+) has badges$/, async function (entityType, dataTable) {
    for (let row of dataTable.hashes()) {
      const selector = Collection.getSelectorForBadgeWithText(row.text)

      await Collection
        .section.firstCollectionItem
        .api.useXpath()
        .assert.visible(selector.selector)
        .useCss()
    }
  })
})
