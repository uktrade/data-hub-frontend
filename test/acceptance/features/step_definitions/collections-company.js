const faker = require('faker')
const { client } = require('nightwatch-cucumber')
const { defineSupportCode } = require('cucumber')

defineSupportCode(({ Given, Then, When }) => {
  const Company = client.page.Company()
  const companyCollections = client.page.CollectionsCompany()

  When(/^I search for this company name$/, async () => {
    await Company
      .navigate()
      .findCompany(Company.newlyCreatedCompanyName)
  })

  Then(/^I view a company tab$/, async () => {
    await companyCollections
      .verify.visible('@companyTab')
  })

  Then(/^I see company name in the list$/, async () => {
    await companyCollections
      .verify.containsText('@companyNameFromFirstList', Company.newlyCreatedCompanyName)
  })

  Then(/^I see sector of the company in the list$/, async () => {
    await companyCollections
      .verify.containsText('@sectorFromFirstList', 'Automotive')
  })

  When(/^I create a new company based in UK$/, async () => {
    const newCompanyName = `QA UK Ltd ${faker.company.companyName()}`

    await Company
      .navigate()
      .findCompany(newCompanyName)
      .createPrivateLimitedCompany(newCompanyName)
  })

  Then(/^I see region of the company in the list$/, async () => {
    await companyCollections
      .verify.containsText('@regionFromFirstList', 'England')
  })
})
