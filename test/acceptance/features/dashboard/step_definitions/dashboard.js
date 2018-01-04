const { client } = require('nightwatch-cucumber')
const { defineSupportCode } = require('cucumber')

defineSupportCode(({ When, Then }) => {
  const Dashboard = client.page.Dashboard()

  When(/^I navigate to the dashboard$/, async () => {
    await Dashboard
      .navigate()
      .waitForElementPresent('@term')
  })

  Then(/^there should only be (DIT|LEP|DA) staff global nav links present$/, async (staffType) => {
    await Dashboard.section.globalHeader
      .waitForElementPresent('@serviceName')

    if (staffType === 'DIT') {
      await Dashboard.section.globalNav
        .assert.visible('@companies')
        .assert.visible('@contacts')
        .assert.visible('@events')
        .assert.visible('@interactionsAndServices')
        .assert.visible('@investmentProjects')
        .assert.visible('@ordersOmis')
        .assert.visible('@miDashboards')
    }

    if (staffType === 'LEP') {
      await Dashboard.section.globalNav
        .assert.visible('@companies')
        .assert.visible('@contacts')
        .assert.visible('@investmentProjects')
        .assert.visible('@miDashboards')

      await Dashboard.section.globalNav
        .assert.elementNotPresent('@events')
        .assert.elementNotPresent('@interactionsAndServices')
        .assert.elementNotPresent('@ordersOmis')
    }

    if (staffType === 'DA') {
      await Dashboard.section.globalNav
        .assert.visible('@companies')
        .assert.visible('@contacts')
        .assert.visible('@investmentProjects')
        .assert.visible('@ordersOmis')
        .assert.visible('@miDashboards')

      await Dashboard.section.globalNav
        .assert.elementNotPresent('@events')
        .assert.elementNotPresent('@interactionsAndServices')
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
})
