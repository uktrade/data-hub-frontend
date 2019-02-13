/* eslint-disable camelcase */
const { get, pickBy, isEmpty } = require('lodash')

const { aboutLabels } = require('../labels')
const { getDataLabels } = require('../../../lib/controller-utils')
const { NONE_TEXT, NOT_AVAILABLE_TEXT } = require('../constants')

module.exports = ({
  trading_names,
  companies_house_data,
  website,
  number_of_employees,
  turnover,
}) => {
  const company_number = get(companies_house_data, 'company_number')

  const viewRecord = {
    trading_names: isEmpty(trading_names) ? NONE_TEXT : trading_names,
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
    turnover: turnover ? `USD ${turnover}` : NOT_AVAILABLE_TEXT,
    number_of_employees: number_of_employees || NOT_AVAILABLE_TEXT,
    website: isEmpty(website) ? NOT_AVAILABLE_TEXT : {
      name: website,
      url: website,
      hint: '(Opens in a new window)',
      hintId: 'external-link-label',
      newWindow: true,
    },
  }

  return pickBy(getDataLabels(viewRecord, aboutLabels))
}
