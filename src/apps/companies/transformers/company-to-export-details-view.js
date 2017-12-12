/* eslint-disable camelcase */
const { flatten } = require('lodash')

const { getDataLabels } = require('../../../lib/controller-utils')
const { exportDetailsLabels } = require('../labels')

module.exports = function transformCompanyToExportDetailsView ({
  export_experience_category,
  export_to_countries,
  future_interest_countries,
}) {
  const viewRecord = {
    exportExperienceCategory: export_experience_category || 'None',
    exportToCountries: flatten([export_to_countries])
      .map(country => (country.name || null))
      .join(', ') || 'None',
    futureInterestCountries: flatten([future_interest_countries])
      .map(country => (country.name || null))
      .join(', ') || 'None',
  }

  return getDataLabels(viewRecord, exportDetailsLabels)
}
