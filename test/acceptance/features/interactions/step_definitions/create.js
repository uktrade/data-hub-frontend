const { client } = require('nightwatch-cucumber')
const { defineSupportCode } = require('cucumber')

defineSupportCode(({ Given, When, Then }) => {
  const Interaction = client.page.Interaction()
  const CompanyList = client.page.CompanyList()

  When(/^browsing to companies$/, async () => {
    await CompanyList
      .navigate()
      .section.firstCompanyInList
      .click('@header')
  })

  When(/^the "Add interaction" button is clicked$/, async () => {
    await Interaction
      .click('@addInteractionButton')
  })

  Then(/^the Add interaction or service page is displayed$/, async () => {
    await Interaction
      .assert.visible('@interactionRadioButton')
      .assert.visible('@serviceDeliveryRadioButton')
      .assert.visible('@continueButton')
  })
})
