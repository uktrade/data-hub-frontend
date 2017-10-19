const { client } = require('nightwatch-cucumber')
const { defineSupportCode } = require('cucumber')
const faker = require('faker')

defineSupportCode(({ Before, Then, When }) => {
  const Company = client.page.Company()

  const getFakeName = (name) => {
    return {
      name: name,
      suffix: faker.random.uuid(),
      getFullName () {
        return `${this.name} ${this.suffix}`
      },
    }
  }

  Before(() => {
    Company.state = {
      companyDetails: {},
      companyName: getFakeName(faker.company.companyName()),
    }
  })

  When(/^a "UK private or public limited company" is created$/, async () => {
    const companyName = Company.state.companyName.getFullName()

    await Company
      .navigate()
      .findCompany(companyName)
      .createUkPrivateOrPublicLimitedCompany(companyName)
  })

  When(/^a "UK non-private or non-public limited company" is created$/, async () => {
    const companyName = Company.state.companyName.getFullName()

    await Company
      .navigate()
      .findCompany(companyName)
      .createUkNonPrivateOrNonPublicLimitedCompany(companyName)
  })

  When(/^a new "Foreign company" is created$/, async () => {
    const companyName = Company.state.companyName.getFullName()

    await Company
      .navigate()
      .findCompany(companyName)
      .createForeignCompany(companyName)
  })

  Then(/^the company is in the search results$/, async () => {
    await Company
      .navigate()
      .findCompany(Company.state.companyName.suffix)
      .assert.containsText('@collectionResultsCompanyName', Company.state.companyName.getFullName())
  })

  Then(/^The company name is present in the collections results/, async () => {
    const companyName = Company.state.companyDetails.name

    await Company
      .searchForCompanyInCollection(companyName)
      .assert.containsText('@collectionResultsCompanyName', companyName)
  })

  Then(/^The company sector is present in the collections results$/, async () => {
    const companyName = Company.state.companyDetails.name

    await Company
      .searchForCompanyInCollection(companyName)
      .assert.containsText('@collectionResultsSectorLabel', 'Sector')
  })

  Then(/^The company region is present in the collections results$/, async () => {
    const companyName = Company.state.companyDetails.name

    await Company
      .searchForCompanyInCollection(companyName)
      .assert.containsText('@collectionResultsRegionLabel', 'UK region')
  })

  Then(/^The company registered address is present in the collections results$/, async () => {
    const companyName = Company.state.companyDetails.name

    await Company
      .searchForCompanyInCollection(companyName)
      .assert.containsText('@collectionResultsRegisteredAddressLabel', 'Registered address')
  })

  Then(/^Clicking the company name takes me to the companies page$/, async () => {
    const companyName = Company.state.companyDetails.name

    await Company
      .click('@collectionResultsCompanyName')
      .assert.containsText('@companyPageHeading', companyName)
  })
})
