const { client } = require('nightwatch-cucumber')
const { defineSupportCode } = require('cucumber')

defineSupportCode(({ Given, Then, When }) => {
  const Company = client.page.Company()

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
})
