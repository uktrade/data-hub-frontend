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
})
