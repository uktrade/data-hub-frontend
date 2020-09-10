const { getOptions } = require('../../../../lib/options')

const hqLabels = {
  ehq: 'European HQ',
  ghq: 'Global HQ',
  ukhq: 'UK HQ',
  trading_names: 'Trading names',
}

async function getHeadquarterOptions(req) {
  const options = await getOptions(req, 'headquarter-type', { sorted: false })
  const headquarterOptions = options.map((option) => ({
    value: option.value,
    label: hqLabels[option.label],
  }))

  headquarterOptions.unshift({
    value: '',
    label: 'Not a headquarters',
  })

  return headquarterOptions
}

module.exports = {
  getHeadquarterOptions,
}
