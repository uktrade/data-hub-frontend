const { client } = require('nightwatch-cucumber')
const { defineSupportCode } = require('cucumber')

defineSupportCode(({ Then, When }) => {
  const CompanyList = client.page.CompanyList()

  When(/^I navigate to the company list page$/, async () => {
    await CompanyList
      .navigate()
      .waitForElementPresent('@h1Element')
  })
})
