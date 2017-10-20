const { client } = require('nightwatch-cucumber')
const { defineSupportCode } = require('cucumber')

defineSupportCode(({ When }) => {
  const Dashboard = client.page.Dashboard()

  When(/^I navigate to the dashboard/, async () => {
    await Dashboard
      .navigate()
      .waitForElementPresent('@term')
  })
})
