const { get, set } = require('lodash')
const { client } = require('nightwatch-cucumber')
const { Given, When, Then } = require('cucumber')
const moment = require('moment')

const { pluralise } = require('../../../../src/config/nunjucks/filters')
const { mediumDateTimeFormat } = require('../../../../src/config')

const Collection = client.page.collection()

Given('I store the result count in state', async function() {
  await Collection.captureResultCount((count) => {
    set(this.state, 'collection.resultCount', parseInt(count))
  })
})

When(/^I clear all filters$/, async function() {
  await Collection.section.collectionHeader
    .click('@removeAllFiltersLink')
    .wait() // wait for xhr
})

Then(
  /^the results summary for (?:a|an).*? (.+) collection is present$/,
  async function(collectionType) {
    await Collection.captureResultCount((count) => {
      set(this.state, 'collection.resultCount', count)
    })

    const resultCount = get(this.state, 'collection.resultCount')
    const collectionTypeTitle = pluralise(collectionType, resultCount)

    await Collection.section.collectionHeader.assert
      .visible('@intro')
      .assert.containsText('@intro', `${resultCount} ${collectionTypeTitle}`)
  }
)

Then(/^there is an? (.+) button in the collection header$/, async function(
  buttonText
) {
  const button = Collection.getButtonSelectorWithText(buttonText)

  await Collection.section.collectionHeader.api
    .useXpath()
    .assert.visible(button.selector)
    .useCss()
})

Then(/^I can view the (.+) in the collection$/, async function(
  entityType,
  dataTable
) {
  await Collection.section.firstCollectionItem

  for (const row of dataTable.hashes()) {
    const metaListValueElement = Collection.getSelectorForMetaListItemValue(
      row.text
    )
    const expectedMetaListValue = get(this.state, row.expected)

    // If we have a value in state that we expecting then test for its contents
    // meaning we can specify metaItems that only appear when specific entries have been made to a form. e.g Uk region
    if (expectedMetaListValue) {
      await Collection.section.firstCollectionItem.api
        .useXpath()
        .assert.containsText(
          metaListValueElement.selector,
          expectedMetaListValue
        )
        .useCss()
    }
  }
})

Then(/^the (.+) has badges$/, async function(entityType, dataTable) {
  for (const row of dataTable.hashes()) {
    const badgeValueElement = Collection.getSelectorForBadgeWithText(row.text)
    const expectedBadgeValue = get(this.state, row.expected)

    // If we have a value in state that we expecting then test for its contents
    // meaning we can specify badges that only appear when specific entries have been made to a form. e.g Uk region
    if (expectedBadgeValue) {
      await Collection.section.firstCollectionItem.api
        .useXpath()
        .assert.visible(badgeValueElement.selector)
        .assert.containsText(badgeValueElement.selector, expectedBadgeValue)
        .useCss()
    }
  }
})

Then(/^there are no filters selected$/, async function() {
  await Collection.api.elements(
    'css selector',
    '.c-collection__filter-tag',
    (result) => {
      client.expect(result.value.length).to.equal(0)
    }
  )
})

Then(/^the result count should be reset$/, async function() {
  await Collection.section.collectionHeader
    .waitForElementVisible('@resultCount')
    .getText('@resultCount', (result) => {
      const expected = get(this.state, 'collection.resultCount')
      client.expect(parseInt(result.value)).to.equal(expected)
    })
})

Then(/^the result count should be ([0-9])$/, async function(expected) {
  await Collection.section.collectionHeader
    .waitForElementVisible('@resultCount')
    .getText('@resultCount', (result) => {
      client.expect(result.value).to.equal(expected)
    })
})

Then(/^the result count should be ([0-9]) less than the total$/, async function(
  valueToSubtract
) {
  await Collection.section.collectionHeader
    .waitForElementVisible('@resultCount')
    .getText('@resultCount', (result) => {
      const total = get(this.state, 'collection.resultCount')
      client
        .expect(parseInt(result.value))
        .to.equal(total - parseInt(valueToSubtract))
    })
})

Then(/^the result count should be less than the total$/, async function() {
  await Collection.section.collectionHeader
    .waitForElementVisible('@resultCount')
    .getText('@resultCount', (result) => {
      const total = get(this.state, 'collection.resultCount')
      client.expect(parseInt(result.value)).to.be.below(total)
    })
})

Then(/^the result count should be greater than ([0-9])/, async function(
  minimum
) {
  await Collection.section.collectionHeader
    .waitForElementVisible('@resultCount')
    .getText('@resultCount', (result) => {
      client.expect(parseInt(result.value)).to.be.above(parseInt(minimum))
    })
})

Then(/^I choose the first item in the collection$/, async function() {
  await Collection.section.firstCollectionItem
    .waitForElementVisible('@link')
    .click('@link')
})

Then(/^I can view the collection$/, async function() {
  await Collection.assert.visible('@collection')
})

Then(/^I can view the entity list/, async function() {
  await Collection.assert.visible('@entityList')
})

Then(/^I see the list in A-Z alphabetical order$/, async function() {
  const firstFieldIsLessThanSecondField =
    this.state.list.firstItem.field.toLowerCase() <
    this.state.list.secondItem.field.toLowerCase()
  const bothFieldsAreTheSame =
    this.state.list.firstItem.field === this.state.list.secondItem.field

  client.expect(
    firstFieldIsLessThanSecondField || bothFieldsAreTheSame
  ).to.be.true
})

Then(/^I see the list in Z-A alphabetical order$/, async function() {
  const firstFieldIsGreaterThanSecondField =
    this.state.list.firstItem.field.toLowerCase() >
    this.state.list.secondItem.field.toLowerCase()
  const bothFieldsAreTheSame =
    this.state.list.firstItem.field === this.state.list.secondItem.field

  client.expect(
    firstFieldIsGreaterThanSecondField || bothFieldsAreTheSame
  ).to.be.true
})

When(
  /^the results are sorted by (Least recently updated|Recently updated)$/,
  async function(sortOption) {
    await Collection.section.collectionHeader
      .waitForElementVisible('@sortBy')
      .clickListOption('sortby', sortOption)
      .wait() // wait for xhr
  }
)

Then(
  /^the results should be sorted by (Least recently updated|Recently updated)$/,
  async function(sortType) {
    const updateValues = {}

    await Collection.section.firstCollectionItem
      .waitForElementPresent('@header')
      .getText('@updatedOn', (text) => {
        updateValues.firstItem = moment(text.value, mediumDateTimeFormat)
      })

    await Collection.section.lastCollectionItem
      .waitForElementPresent('@header')
      .getText('@updatedOn', (text) => {
        updateValues.lastItem = moment(text.value, mediumDateTimeFormat)
      })

    if (sortType === 'Recently updated') {
      client.expect(updateValues.firstItem.isSameOrAfter(updateValues.lastItem))
        .to.be.true
    } else {
      client.expect(
        updateValues.firstItem.isSameOrBefore(updateValues.lastItem)
      ).to.be.true
    }
  }
)
