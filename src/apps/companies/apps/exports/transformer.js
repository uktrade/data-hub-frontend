/* eslint-disable camelcase */
const { flatMap } = require('lodash')

const groupExportCountries = require('../../../../lib/group-export-countries')
const { formatDateTime } = require('../../../../config/nunjucks/filters')
const { exportDetailsLabels, exportPotentialLabels } = require('../../labels')
const { EXPORT_INTEREST_STATUS } = require('../../../constants')

const COUNTRY_HISTORY_TYPE_TEXT = {
  insert: 'added to',
  delete: 'removed from',
}
const COUNTRY_TYPE_TEXT = {
  future_interest: 'future countries of interest',
  currently_exporting: 'currently exporting',
  not_interested: 'countries of no interest',
}

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

function createCountry(item) {
  return {
    headingText: getCountryText(
      item.country.name,
      item.history_type,
      item.status
    ),
    metadata: [
      { label: 'By', value: item.history_user.name },
      { label: 'Date', value: formatDateTime(item.history_date) },
    ],
  }
}

module.exports = {
  transformFullExportHistory: (data) => ({
    count: data.count,
    results: data.results.map(createCountry),
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
