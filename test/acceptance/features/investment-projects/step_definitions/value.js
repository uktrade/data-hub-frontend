const { client } = require('nightwatch-cucumber')
const { When } = require('cucumber')
const { set, get, assign, fromPairs, map, camelCase } = require('lodash')

const InvestmentValue = client.page.investments.value()

When(/^I populate the create investment project value form$/, async function(
  dataTable
) {
  const details = fromPairs(
    map(dataTable.hashes(), (hash) => [camelCase(hash.key), hash.value])
  )
  await InvestmentValue.add(details, (value) => {
    const investmentProject = get(this.state, 'investmentProject')
    set(
      this.state,
      'investmentProject',
      assign({}, investmentProject, { value })
    )
  })
})
