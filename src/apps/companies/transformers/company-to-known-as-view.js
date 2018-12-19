/* eslint-disable camelcase */
const { get, pickBy } = require('lodash')

const { knownAsLabels } = require('../labels')
const { getDataLabels } = require('../../../lib/controller-utils')

module.exports = ({
  trading_names,
  companies_house_data,
}) => {
  const company_number = get(companies_house_data, 'company_number')

  const viewRecord = {
    trading_names: trading_names && trading_names.length ? trading_names : 'None',
    company_number: company_number ? [
      company_number,
      {
        url: `https://beta.companieshouse.gov.uk/company/${company_number}`,
        name: 'View on Companies House website',
        hint: '(Opens in a new window)',
        hintId: 'external-link-label',
        newWindow: true,
      },
    ] : null,
  }

  return pickBy(getDataLabels(viewRecord, knownAsLabels))
}
