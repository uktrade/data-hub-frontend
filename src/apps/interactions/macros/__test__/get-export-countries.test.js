const faker = require('faker')

const { EXPORT_INTEREST_STATUS } = require('../../constants')
const getExportCountries = require('../get-export-countries')

describe('getExportCountries', () => {
  it('should transform the countries into an object', () => {
    const countries = Array.from({ length: 6 }).map(faker.random.uuid)

    const future = countries.slice(0, 2)
    const exporting = countries.slice(2, 4)
    const notInterested = countries.slice(4, 6)

    expect(getExportCountries({
      [EXPORT_INTEREST_STATUS.FUTURE_INTEREST]: future,
      [EXPORT_INTEREST_STATUS.EXPORTING_TO]: exporting,
      [EXPORT_INTEREST_STATUS.NOT_INTERESTED]: notInterested,
    })).to.deep.equal([
      {
        country: { id: countries[0] },
        status: EXPORT_INTEREST_STATUS.FUTURE_INTEREST,
      }, {
        country: { id: countries[1] },
        status: EXPORT_INTEREST_STATUS.FUTURE_INTEREST,
      }, {
        country: { id: countries[2] },
        status: EXPORT_INTEREST_STATUS.EXPORTING_TO,
      }, {
        country: { id: countries[3] },
        status: EXPORT_INTEREST_STATUS.EXPORTING_TO,
      }, {
        country: { id: countries[4] },
        status: EXPORT_INTEREST_STATUS.NOT_INTERESTED,
      }, {
        country: { id: countries[5] },
        status: EXPORT_INTEREST_STATUS.NOT_INTERESTED,
      },
    ])
  })
})
