/* eslint-disable camelcase */
const { get, pickBy } = require('lodash')

const { companyDetailsLabels } = require('../labels')
const { getDataLabels } = require('../../../lib/controller-utils')

module.exports = ({
  trading_name,
  companies_house_data,
}) => {
  const company_number = get(companies_house_data, 'company_number')

  const viewRecord = {
    trading_name: trading_name || 'None',
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

  return pickBy(getDataLabels(viewRecord, companyDetailsLabels))
}
