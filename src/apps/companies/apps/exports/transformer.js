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

function getCountryText(country, historyType, status) {
  const historyTypeText = COUNTRY_HISTORY_TYPE_TEXT[historyType]
  const typeText = COUNTRY_TYPE_TEXT[status]

  return [country, historyTypeText, typeText].join(' ')
}

function createCountry({
  country,
  history_type,
  status,
  history_user,
  history_date,
}) {
  return {
    headingText: getCountryText(country.name, history_type, status),
    metadata: [
      { label: 'By', value: history_user.name },
      { label: 'Date', value: formatDateTime(history_date) },
    ],
  }
}

module.exports = {
  transformFullExportHistory: ({ count, results }) => ({
    count: count,
    results: results.map(createCountry),
  }),
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
