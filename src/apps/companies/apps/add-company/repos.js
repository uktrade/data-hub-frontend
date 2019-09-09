const { filter } = require('lodash')

const { getOptions } = require('../../../../lib/options')

const METADATA_COUNTRY_UK_LABEL = 'United Kingdom'

async function fetchForeignCountries ({ token, domesticCountry = METADATA_COUNTRY_UK_LABEL }) {
  const countries = await getOptions(token, 'country')
  return filter(countries, ({ label }) => { return label !== domesticCountry })
}

module.exports = {
  fetchForeignCountries,
}
