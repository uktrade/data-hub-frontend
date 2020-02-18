const metadata = require('../../../src/lib/metadata')
const { generateCountries } = require('./generate-export-countries')

const COUNTRIES = 'countryOptions'

function createMockCountries(count) {
  metadata[COUNTRIES] = generateCountries(count).map(({ id, name }) => ({
    id,
    name,
    disabed_on: null,
  }))
}

module.exports = {
  setCountries: (count) => {
    if (metadata.hasOwnProperty(COUNTRIES)) {
      const existingData = metadata[COUNTRIES]
      createMockCountries(count)
      return function revertCountries() {
        metadata[COUNTRIES] = existingData
      }
    } else {
      createMockCountries(count)
      return function revertCountries() {
        delete metadata[COUNTRIES]
      }
    }
  },
}
