const { client } = require('nightwatch-cucumber')
const { defineSupportCode } = require('cucumber')
const {
  set,
  get,
  assign,
  fromPairs,
  map,
  camelCase,
} = require('lodash')

defineSupportCode(({ When }) => {
  const InvestmentValue = client.page.InvestmentValue()

  When(/^I populate the create investment project value form all (Yes|No)$/, async function (answer, dataTable) {
    const details = fromPairs(map(dataTable.hashes(), hash => [camelCase(hash.key), hash.value]))
    await InvestmentValue
      .add(details, answer, (value) => {
        const investmentProject = get(this.state, 'investmentProject')
        set(this.state, 'investmentProject', assign({}, investmentProject, { value }))
      })
  })
})
