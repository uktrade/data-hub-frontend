const { EXPORT_INTEREST_STATUS } = require('../../apps/constants')

const { generateExportCountries, generateCountries, createExportCountry } = require('../../../test/unit/helpers/generate-export-countries')

function convertToObjects (countries) {
  return countries.map(([id, name]) => ({ id, name }))
}

const groupExportCountries = require('../group-export-countries')

describe('groupExportCountries', () => {
  context('With no countries', () => {
    it('Should return an empty object', () => {
      expect(groupExportCountries()).to.deep.equal({})
    })
  })

  context('With countries for each status', () => {
    it('Should separate out the countries', () => {
      const { future, current, noInterest, exportCountries } = generateExportCountries()

      const buckets = groupExportCountries(exportCountries)

      expect(buckets[EXPORT_INTEREST_STATUS.FUTURE_INTEREST]).to.deep.equal(convertToObjects(future))
      expect(buckets[EXPORT_INTEREST_STATUS.EXPORTING_TO]).to.deep.equal(convertToObjects(current))
      expect(buckets[EXPORT_INTEREST_STATUS.NOT_INTERESTED]).to.deep.equal(convertToObjects(noInterest))
    })
  })

  context('With unexpected statuses', () => {
    it('Should only return the known statuses', () => {
      const FAKE_STATUS = 'fake-status'
      const { future, current, noInterest, exportCountries } = generateExportCountries()

      exportCountries.push(...generateCountries(2).map(createExportCountry(FAKE_STATUS)))

      const buckets = groupExportCountries(exportCountries)

      expect(buckets[EXPORT_INTEREST_STATUS.FUTURE_INTEREST]).to.deep.equal(convertToObjects(future))
      expect(buckets[EXPORT_INTEREST_STATUS.EXPORTING_TO]).to.deep.equal(convertToObjects(current))
      expect(buckets[EXPORT_INTEREST_STATUS.NOT_INTERESTED]).to.deep.equal(convertToObjects(noInterest))
      expect(buckets[FAKE_STATUS]).to.be.undefined
    })
  })
})
