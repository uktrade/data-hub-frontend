const { set } = require('lodash')
const { client } = require('nightwatch-cucumber')
const { Then } = require('cucumber')

Then('I choose the company’s primary sector', async function() {
  const SectorPage = client.page.omis.create.sector()

  await SectorPage.getText('@companySector', (result) => {
    set(this.state, 'omis.create.sector.sectorField', result.value)
  }).click('@useCompanySectorOption')
})
