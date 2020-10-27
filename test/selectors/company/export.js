const { EXPORT_INTEREST_STATUS } = require('../../../src/apps/constants')

module.exports = {
  winCategory: '#export_experience_category',
  countries: {
    listItemHeadings: '#company-export-full-history > div > div h3',
    future: '#field-' + EXPORT_INTEREST_STATUS.FUTURE_INTEREST,
    export: '#field-' + EXPORT_INTEREST_STATUS.EXPORTING_TO,
    noInterest: '#field-' + EXPORT_INTEREST_STATUS.NOT_INTERESTED,
  },
  exportWins: {
    listItemHeadings: '#company-export-index-page > div > div h3',
  },
}
