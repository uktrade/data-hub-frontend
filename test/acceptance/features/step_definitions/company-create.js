const shortId = require('shortid')
const { client } = require('nightwatch-cucumber')
const { defineSupportCode } = require('cucumber')

defineSupportCode(({ Given, Then, When }) => {
  const Company = client.page.Company()
  const Login = client.page.Login()

  Given(/^I am an authenticated user on Data Hub website$/, async () => {
    await client.page.Login().navigate().authenticate()
  })

  When(/^I create a new “Foreign organisation”$/, async () => {
    const newCompanyName = `QA Foreign Company ${shortId.generate()}`

    await Company
      .navigate()
      .findCompany(newCompanyName)
      .createForeignOrg(newCompanyName)
  })

  When(/^I create a new “Other type of UK Organisation”$/, async () => {
    const newCompanyName = `QA UK Other ${shortId.generate()}`

    await Company
      .navigate()
      .findCompany(newCompanyName)
      .createOtherTypeUKOrg(newCompanyName)
  })

  When(/^I create a new “UK private or public limited company”$/, async () => {
    const newCompanyName = `QA UK Ltd ${shortId.generate()}`

    await Company
      .navigate()
      .findCompany(newCompanyName)
      .createPrivateLimitedCompany(newCompanyName)
  })

  Then(/^I verify that my newly created company is present in search results$/, async () => {
    await Company
      .navigate()
      .findCompany(Company.newlyCreatedCompanyName)
      .verify.visible('@searchResultsItem')
  })

  Then(/^I logout of Data Hub website$/, async () => {
    await Login
      .click('@signOutButton')
  })
})
