const { client } = require('nightwatch-cucumber')
const { Then, When } = require('cucumber')

const Dashboard = client.page.Dashboard()

When(/^I navigate to the dashboard$/, async () => {
  await Dashboard
    .navigate()
    .waitForElementPresent('@term')
})

Then(/^there should be a global nav$/, async (dataTable) => {
  await Dashboard.section.globalHeader
    .waitForElementPresent('@serviceName')

  const expectedGlobalNav = dataTable.hashes()

  await Dashboard.api.elements('css selector', '.c-global-nav__link', (result) => {
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

Then(/^I navigate to the support page$/, async () => {
  await Dashboard.section.globalHeader
    .assert.visible('@support')
    .click('@support')

  await Dashboard
    .waitForElementVisible('@pageHeading')
    .assert.visible('@pageHeading')
    .assert.containsText('@pageHeading', 'Report a problem or leave feedback')
})
