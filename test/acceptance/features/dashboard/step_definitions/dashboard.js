const { client } = require('nightwatch-cucumber')
const { defineSupportCode } = require('cucumber')

defineSupportCode(({ When, Then }) => {
  const Dashboard = client.page.Dashboard()

  When(/^I navigate to the dashboard$/, async () => {
    await Dashboard
      .navigate()
      .waitForElementPresent('@term')
  })

  When(/^the (.+) link in the global nav is clicked$/, async (link) => {
    await Dashboard.section.globalNav
      .click(`@${link}`)
  })

  Then(/^there should be global nav links$/, async () => {
    await Dashboard.section.globalNav
      .assert.visible('@companies')
      .assert.visible('@contacts')
      .assert.visible('@events')
      .assert.visible('@interactionsAndServices')
      .assert.visible('@investmentProjects')
      .assert.visible('@ordersOmis')
      .assert.visible('@miDashboards')
  })
})
