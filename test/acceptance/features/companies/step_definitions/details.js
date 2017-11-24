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

  Then(/^the company details are displayed$/, async function () {
    const {
      // businessType, todo: case issues
      primaryAddress,
      headquarterType,
      // sector, todo: https://uktrade.atlassian.net/browse/DH-1086
      website,
      description,
      employeeRange,
      turnoverRange,
    } = this.state.company

    await Company
      .section.companyDetails
      // .assert.containsText('@businessType', businessType) todo: case issues
      .assert.containsText('@primaryAddress', primaryAddress)
      .assert.containsText('@headquarters', headquarterType)
      // .assert.containsText('@sector', sector) todo: https://uktrade.atlassian.net/browse/DH-1086
      .assert.containsText('@website', website)
      .assert.containsText('@businessDescription', description)
      .assert.containsText('@numberOfEmployees', employeeRange)
      .assert.containsText('@annualTurnover', turnoverRange)
  })

  Then(/^the company details UK region is displayed$/, async function () {
    const { ukRegion } = this.state.company

    await Company
      .section.companyDetails
      .assert.containsText('@ukRegion', ukRegion)
  })

  Then(/^the company details CDMS reference is displayed$/, async function () {
    const { referenceCode } = this.state.company

    await Company
      .section.companyDetails
      .assert.containsText('@cdmsReference', referenceCode)
  })

  Then(/^the company details CDMS reference is not displayed$/, async function () {
    await Company
      .section.companyDetails
      .assert.elementNotPresent('@cdmsReference')
  })
})
