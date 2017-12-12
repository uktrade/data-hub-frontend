const { client } = require('nightwatch-cucumber')
const { defineSupportCode } = require('cucumber')

defineSupportCode(({ Given, Then, When }) => {
  const Company = client.page.Company()

  Then(/^the company details UK region is displayed$/, async function () {
    const { ukRegion } = this.state.company

    await Company
      .section.companyDetails
      .assert.containsText('@ukRegion', ukRegion)
  })
})
