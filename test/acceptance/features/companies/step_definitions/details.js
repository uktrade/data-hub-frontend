const { client } = require('nightwatch-cucumber')
const { Then } = require('cucumber')

const Company = client.page.Company()

Then(/^the company details UK region is displayed$/, async function () {
  const { ukRegion } = this.state.company

  await Company
    .section.companyDetails
    .assert.containsText('@ukRegion', ukRegion)
})
