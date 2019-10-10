const { getOptions } = require('../../../../lib/options')

const hqLabels = {
  ehq: 'European HQ',
  ghq: 'Global HQ',
  ukhq: 'UK HQ',
  trading_names: 'Trading names',
}

async function getHeadquarterOptions (token) {
  const options = await getOptions(token, 'headquarter-type', { sorted: false })
  const headquarterOptions = options.map(option => ({
    value: option.value,
    label: hqLabels[option.label],
  }))

  headquarterOptions.unshift({
    value: 'not_headquarters',
    label: 'Not a headquarters',
  })

  return headquarterOptions
}

module.exports = {
  getHeadquarterOptions,
}
