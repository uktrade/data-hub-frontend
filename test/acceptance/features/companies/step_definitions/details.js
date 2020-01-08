const { client } = require('nightwatch-cucumber')
const { Then } = require('cucumber')

const Company = client.page.companies.company()

Then(/^the company details UK region is displayed$/, async function() {
  const { ukRegion } = this.state.company

  await Company.section.regionDetails.assert.containsText('@ukRegion', ukRegion)
})
