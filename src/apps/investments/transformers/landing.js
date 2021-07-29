/* eslint-disable camelcase */
const { get, compact } = require('lodash')

const { formatLongDate } = require('../../../client/utils/date')

function transformInvestmentLandingForView({ uk_company, actual_land_date }) {
  return {
    uk_company: uk_company
      ? {
          name: uk_company.name,
          url: `/companies/${uk_company.id}`,
        }
      : null,
    company_number: get(uk_company, 'company_number'),
    registered_address: uk_company
      ? compact([
          uk_company.address.line_1,
          uk_company.address.line_2,
          uk_company.address.town,
          uk_company.address.county,
          uk_company.address.postcode,
          uk_company.address.country.name,
        ])
      : null,
    actual_land_date: actual_land_date
      ? formatLongDate(actual_land_date)
      : null,
  }
}

module.exports = {
  transformInvestmentLandingForView,
}
