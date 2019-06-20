const { client } = require('nightwatch-cucumber')
const { Then } = require('cucumber')

const Dashboard = client.page.dashboard()

Then(/^there should be a global nav$/, async (dataTable) => {
  await Dashboard.section.globalHeader
    .waitForElementPresent('@serviceName')

  const expectedGlobalNav = dataTable.hashes()

  await Dashboard.api.elements('css selector', '.datahub-header__navigation__item__link', (result) => {
    client.expect(result.value.length).to.equal(expectedGlobalNav.length)
  })

  for (const row of expectedGlobalNav) {
    const globalNavItemSelector = Dashboard.getGlobalNavItemSelector(row.text)
    await Dashboard
      .api.useXpath()
      .waitForElementPresent(globalNavItemSelector.selector)
      .assert.visible(globalNavItemSelector.selector)
      .useCss()
  }
})
