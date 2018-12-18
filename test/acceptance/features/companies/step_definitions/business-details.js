const { client } = require('nightwatch-cucumber')
const { Then } = require('cucumber')

const { getSelectorForElementWithText } = require('../../../helpers/selectors')

const BusinessDetailsPage = client.page.companies['business-details']()

const getAddressSelector = (tableNumber) => {
  return getSelectorForElementWithText('Addresses', {
    el: '//h2',
    child: `/following-sibling::table[${tableNumber}]`,
  })
}

const getBadgeSelector = (text) => {
  return getSelectorForElementWithText(text, {
    el: '//span',
    className: 'c-badge',
  })
}

const getAddressLineSelector = (text) => {
  return getSelectorForElementWithText(text, {
    el: '//li',
  })
}

Then(/^address ([0-9]+) should have badges/, async function (addressNumber, dataTable) {
  const addressSelector = getAddressSelector(addressNumber)

  for (const row of dataTable.hashes()) {
    const badgeSelector = getBadgeSelector(row.value)

    await BusinessDetailsPage
      .api.useXpath()
      .waitForElementPresent(addressSelector.selector + badgeSelector.selector)
      .useCss()
  }
})

Then(/^address ([0-9]+) should be/, async function (addressNumber, dataTable) {
  const addressSelector = getAddressSelector(addressNumber)

  for (const row of dataTable.hashes()) {
    const addressLineSelector = getAddressLineSelector(row.value)

    await BusinessDetailsPage
      .api.useXpath()
      .waitForElementPresent(addressSelector.selector + addressLineSelector.selector)
      .useCss()
  }
})
