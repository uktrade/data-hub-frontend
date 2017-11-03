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

  // TODO make sure support can be accessed form different pages
  // TODO make sure support form works
  // TODO potentially send test support request, if we can somehow test it has been received?
  // TODO maybe even split support out into its own thing
  Then(/^I navigate to the support page$/, async () => {
    await Dashboard.section.globalHeader
      .assert.visible('@support')
      .click('@support')

    await Dashboard
      .waitForElementVisible('@pageHeading')
      .assert.visible('@pageHeading')
      .assert.containsText('@pageHeading', 'Report a problem or leave feedback')
  })
})
