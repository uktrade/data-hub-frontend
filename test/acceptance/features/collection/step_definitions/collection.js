const { get, set, camelCase } = require('lodash')
const { client } = require('nightwatch-cucumber')
const { defineSupportCode } = require('cucumber')

const { getButtonWithText } = require('../../../helpers/selectors')

defineSupportCode(({ When, Then }) => {
  const Collection = client.page.Collection()

  When(/^I navigate to the (.+) collection page$/, async function (collectionType) {
    const url = this.urls[camelCase(collectionType)].collection

    await client
      .url(url)

    await Collection
      .section.collectionHeader
      .waitForElementVisible('@resultCount')
      .getText('@resultCount', (result) => {
        set(this.state, 'collection.resultCount', result.value)
      })
  })

  When(/^I click the "(.+)" link$/, async (linkTextContent) => {
    const { selector: addLink } = getButtonWithText(linkTextContent)

    await Collection
      .api.useXpath()
      .waitForElementVisible(addLink)
      .assert.containsText(addLink, linkTextContent)
      .click(addLink)
      .useCss()
  })

  Then(/^I capture the modified on date for the first item$/, async function () {
    await Collection
      .section.firstCollectionItem
      .waitForElementPresent('@updated')
      .getText('@updated', (updated) => {
        set(this.state, 'collection.updated', updated.value)
      })
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

  Then(/^there is an (.+) button in the collection header$/, async function (buttonText) {
    const button = Collection
      .getButtonSelectorWithText(buttonText)

    await Collection
      .section.collectionHeader
      .api.useXpath()
      .assert.visible(button.selector)
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

  Then(/^there are no filters selected$/, async function () {
    await Collection
      .api.elements('css selector', '.c-collection__filter-tag', (result) => {
        client.expect(result.value.length).to.equal(0)
      })
  })

  Then(/^the result count should be reset$/, async function () {
    await Collection
      .section.collectionHeader
      .waitForElementVisible('@resultCount')
      .getText('@resultCount', (result) => {
        const expected = get(this.state, 'collection.resultCount')
        client.expect(result.value).to.equal(expected)
      })
  })
})
