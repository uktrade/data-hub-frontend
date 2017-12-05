const { client } = require('nightwatch-cucumber')
const { defineSupportCode } = require('cucumber')
const { map, find, set } = require('lodash')

defineSupportCode(({ Given, Then, When }) => {
  const Company = client.page.Company()

  When(/^browsing to company fixture (.+)$/, async function (companyName) {
    const companies = map(this.fixtures.company, (company) => { return company })
    const company = find(companies, { name: companyName })
    const url = this.urls.companies.getDetails(company.pk)

    set(this.state, 'company', company)

    await client
      .url(url)
  })

  Then(/^the company details UK region is displayed$/, async function () {
    const { ukRegion } = this.state.company

    await Company
      .section.companyDetails
      .assert.containsText('@ukRegion', ukRegion)
  })
})
