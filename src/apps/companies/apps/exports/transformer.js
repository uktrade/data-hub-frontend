/* eslint-disable camelcase */
const groupExportCountries = require('../../../../lib/group-export-countries')
const { exportDetailsLabels, exportPotentialLabels } = require('../../labels')
const { EXPORT_INTEREST_STATUS } = require('../../../constants')

function getCountriesFields(company) {
  const buckets = groupExportCountries(company.export_countries)

  return {
    exportToCountries: buckets[EXPORT_INTEREST_STATUS.EXPORTING_TO],
    futureInterestCountries: buckets[EXPORT_INTEREST_STATUS.FUTURE_INTEREST],
    noInterestCountries: buckets[EXPORT_INTEREST_STATUS.NOT_INTERESTED],
  }
}

module.exports = {
  transformCompanyToExportDetailsView: (company) => {
    const {
      exportToCountries,
      futureInterestCountries,
      noInterestCountries,
    } = getCountriesFields(company)

    const exportWinCategory = {
      name: exportDetailsLabels.exportExperienceCategory,
      value:
        company.export_experience_category &&
        company.export_experience_category.name,
    }

    const greatProfile = {
      name: exportDetailsLabels.greatProfile,
      value: company.great_profile_status,
    }

    const exportPotential = {
      name: exportDetailsLabels.exportPotential,
      value:
        exportPotentialLabels[company.export_potential] &&
        exportPotentialLabels[company.export_potential].text,
    }

    const exportCountriesInformation = [
      {
        name: exportDetailsLabels.exportToCountries,
        value: exportToCountries,
      },
      {
        name: exportDetailsLabels.futureInterestCountries,
        value: futureInterestCountries,
      },
      {
        name: exportDetailsLabels.noInterestCountries,
        value: noInterestCountries,
      },
    ]

    return {
      exportWinCategory,
      greatProfile,
      exportPotential,
      exportCountriesInformation,
    }
  },
}
