/* eslint-disable camelcase */
const groupExportCountries = require('../../../../lib/group-export-countries')
const { exportDetailsLabels, exportPotentialLabels } = require('../../labels')
const { EXPORT_INTEREST_STATUS } = require('../../../constants')

function getCountriesFields(company) {
  const groupedExportCountries = groupExportCountries(company.export_countries)

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
  transformCompanyToExportDetailsView: (company) => {
    const { exportToCountries, futureInterestCountries, noInterestCountries } =
      getCountriesFields(company)

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

    return {
      exportWinCategory,
      greatProfile,
      exportPotential,
      exportCountriesInformation,
    }
  },
}
