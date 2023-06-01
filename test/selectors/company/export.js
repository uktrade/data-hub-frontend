const { EXPORT_INTEREST_STATUS } = require('../../../src/apps/constants')

module.exports = {
  winCategory: '#export_experience_category',
  countries: {
    future: '#field-' + EXPORT_INTEREST_STATUS.FUTURE_INTEREST,
    export: '#field-' + EXPORT_INTEREST_STATUS.EXPORTING_TO,
    noInterest: '#field-' + EXPORT_INTEREST_STATUS.NOT_INTERESTED,
  },
}
