const { client } = require('nightwatch-cucumber')
const { defineSupportCode } = require('cucumber')

defineSupportCode(({ Given, Then, When }) => {
  const Company = client.page.Company()

  Then(/^the company details are displayed$/, async function () {
    const {
      // businessType, todo: case issues
      address1,
      town,
      country,
      ukRegion,
      // sector, todo: https://uktrade.atlassian.net/browse/DH-1086
    } = this.state.company
    const expectedAddress = `${address1}, ${town}, ${country}`

    await Company
      .section.companyDetails
      // .assert.containsText('@businessType', businessType) todo: case issues
      .assert.containsText('@primaryAddress', expectedAddress)
      .assert.containsText('@ukRegion', ukRegion)
      .assert.containsText('@headquarters', 'Not a headquarters')
      // .assert.containsText('@sector', sector) todo: https://uktrade.atlassian.net/browse/DH-1086
  })

  Then(/^the company details UK region is displayed$/, async function () {
    const { ukRegion } = this.state.company

    await Company
      .section.companyDetails
      .assert.containsText('@ukRegion', ukRegion)
  })
})
