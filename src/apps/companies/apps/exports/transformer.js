/* eslint-disable camelcase */
const { flatMap } = require('lodash')

const groupExportCountries = require('../../../../lib/group-export-countries')
const { exportDetailsLabels, exportPotentialLabels } = require('../../labels')
const { EXPORT_INTEREST_STATUS } = require('../../../constants')

function getCountries(data) {
  return flatMap(data, ({ name }) => name || null).join(', ') || 'None'
}

function getCountriesFields(company) {
  const buckets = groupExportCountries(company.export_countries)

  return {
    exportToCountries: getCountries(
      buckets[EXPORT_INTEREST_STATUS.EXPORTING_TO]
    ),
    futureInterestCountries: getCountries(
      buckets[EXPORT_INTEREST_STATUS.FUTURE_INTEREST]
    ),
    noInterestCountries: getCountries(
      buckets[EXPORT_INTEREST_STATUS.NOT_INTERESTED]
    ),
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
