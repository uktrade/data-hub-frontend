/* eslint-disable camelcase */
const groupExportCountries = require('../../../../lib/group-export-countries')
const { exportDetailsLabels } = require('../../labels')
const { EXPORT_INTEREST_STATUS } = require('../../../constants')

function getCountriesFields(companyExportCountries) {
  const groupedExportCountries = groupExportCountries(companyExportCountries)

  return {
    exportToCountries:
      groupedExportCountries[EXPORT_INTEREST_STATUS.EXPORTING_TO],
    futureInterestCountries:
      groupedExportCountries[EXPORT_INTEREST_STATUS.FUTURE_INTEREST],
    noInterestCountries:
      groupedExportCountries[EXPORT_INTEREST_STATUS.NOT_INTERESTED],
  }
}

module.exports = {
  transformExportCountries: (companyExportCountries) => {
    const { exportToCountries, futureInterestCountries, noInterestCountries } =
      getCountriesFields(companyExportCountries)

    return [
      {
        name: exportDetailsLabels.exportToCountries,
        values: exportToCountries,
      },
      {
        name: exportDetailsLabels.futureInterestCountries,
        values: futureInterestCountries,
      },
      {
        name: exportDetailsLabels.noInterestCountries,
        values: noInterestCountries,
      },
    ]
  },
}
