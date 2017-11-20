/* eslint-disable camelcase */
const { flatten } = require('lodash')

const { getDataLabels } = require('../../../lib/controller-utils')
const { exportDetailsLabels } = require('../labels')

module.exports = function transformCompanyToExportDetailsView ({
  export_to_countries,
  future_interest_countries,
}) {
  const viewRecord = {
    exportToCountries: flatten([export_to_countries])
      .map(country => (country.name || null))
      .join(', '),
    futureInterestCountries: flatten([future_interest_countries])
      .map(country => (country.name || null))
      .join(', '),
  }

  return getDataLabels(viewRecord, exportDetailsLabels)
}
