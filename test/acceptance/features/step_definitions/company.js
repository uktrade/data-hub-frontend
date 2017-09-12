const shortId = require('shortid')
const { client } = require('nightwatch-cucumber')
const { defineSupportCode } = require('cucumber')

defineSupportCode(({ Then, When }) => {
  const Company = client.page.Company()

  When(/^I create a "UK private or public limited company"$/, async () => {
    const companyName = `QA UK private or public Ltd ${shortId.generate()}`

    await Company
      .navigate()
      .findCompany(companyName)
      .createUkPrivateOrPublicLimitedCompany(companyName)
  })

  When(/^I create a "UK non-private or non-public limited company"$/, async () => {
    const companyName = `QA UK non-private or non-public Ltd ${shortId.generate()}`

    await Company
      .navigate()
      .findCompany(companyName)
      .createUkNonPrivateOrNonPublicLimitedCompany(companyName)
  })

  When(/^I create a new "Foreign company"$/, async () => {
    const companyName = `QA Foreign Company ${shortId.generate()}`

    await Company
      .navigate()
      .findCompany(companyName)
      .createForeignCompany(companyName)
  })

  Then(/^The company is present in the search results$/, async () => {
    await Company
      .navigate()
      .findCompany(Company.companyName)
      .verify.visible('@searchResultsItem')
  })

  Then(/^The company name is present in the collections results/, async () => {
    await Company
      .searchForCompanyInCollection(Company.companyName)
      .assert.containsText('@collectionResultsCompanyName', Company.companyName)
  })

  Then(/^The company sector is present in the collections results$/, async () => {
    await Company
      .searchForCompanyInCollection(Company.companyName)
      .assert.containsText('@collectionResultsSectorLabel', 'Sector')
  })

  Then(/^The company region is present in the collections results$/, async () => {
    await Company
      .searchForCompanyInCollection(Company.companyName)
      .assert.containsText('@collectionResultsRegionLabel', 'UK region')
  })

  Then(/^The company registered address is present in the collections results$/, async () => {
    await Company
      .searchForCompanyInCollection(Company.companyName)
      .assert.containsText('@collectionResultsRegisteredAddressLabel', 'Registered address')
  })

  Then(/^Clicking the company name takes me to the companies page$/, async () => {
    await Company
      .click('@collectionResultsCompanyName')
      .assert.containsText('@companyPageHeading', Company.companyName)
  })
})
