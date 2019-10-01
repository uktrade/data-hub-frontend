/* eslint-disable camelcase */
const { flatMap } = require('lodash')

const { getDataLabels } = require('../../../lib/controller-utils')
const { exportDetailsLabels, exportPotentialLabels } = require('../labels')

function getCountries (data) {
  return flatMap(data, ({ name }) => (name || null)).join(', ') || 'None'
}

function getExportPotentialLabel (key) {
  const item = exportPotentialLabels[ key ]

  return (item && item.text) || 'No score given'
}

module.exports = function transformCompanyToExportDetailsView ({
  export_experience_category,
  export_to_countries,
  future_interest_countries,
  export_potential_score,
}) {
  const viewRecord = {
    exportExperienceCategory: export_experience_category || 'None',
    exportToCountries: getCountries(export_to_countries),
    futureInterestCountries: getCountries(future_interest_countries),
    exportPotential: getExportPotentialLabel(export_potential_score),
  }

  return getDataLabels(viewRecord, exportDetailsLabels)
}
