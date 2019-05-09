/* eslint-disable camelcase */
const { get, pickBy, isEmpty } = require('lodash')

const { aboutLabels } = require('../labels')
const { getDataLabels } = require('../../../lib/controller-utils')
const { NOT_SET_TEXT } = require('../constants')
const { currencyRate } = require('../../../../config')

function transformTurnover (turnover, is_turnover_estimated, turnover_range) {
  if (turnover) {
    const items = [{
      name: turnover * currencyRate.usdToGbp,
      type: 'currency',
    }]

    if (is_turnover_estimated) {
      items.push({
        name: 'This is an estimated number',
        type: 'details',
        details: {
          summaryText: 'What does that mean?',
          text: 'Actual turnover is not available for this business. The number has been modelled by Dun & Bradstreet, based on similar businesses.',
        },
      })
    }

    return items
  }

  return get(turnover_range, 'name', NOT_SET_TEXT)
}

function transformNumberOfEmployees (number_of_employees, is_number_of_employees_estimated, employee_range) {
  if (number_of_employees) {
    const items = [{
      name: number_of_employees,
      type: 'number',
    }]

    if (is_number_of_employees_estimated) {
      items.push({
        name: 'This is an estimated number',
        type: 'details',
        details: {
          summaryText: 'What does that mean?',
          text: 'Actual number of employees is not available for this business. The number has been modelled by Dun & Bradstreet, based on similar businesses.',
        },
      })
    }

    return items
  }

  return get(employee_range, 'name', NOT_SET_TEXT)
}

function transformCompanyNumber (company_number) {
  if (company_number) {
    return [
      company_number,
      {
        url: `https://beta.companieshouse.gov.uk/company/${company_number}`,
        name: 'View on Companies House website',
        hint: '(Opens in a new window)',
        hintId: 'external-link-label',
        newWindow: true,
      },
    ]
  }
}

function transformWebsite (website) {
  if (isEmpty(website)) {
    return NOT_SET_TEXT
  }

  return {
    name: website,
    url: website,
    hint: '(Opens in a new window)',
    hintId: 'external-link-label',
    newWindow: true,
  }
}

module.exports = ({
  vat_number,
  reference_code,
  duns_number,
  business_type,
  trading_names,
  company_number,
  turnover,
  is_turnover_estimated,
  turnover_range,
  number_of_employees,
  is_number_of_employees_estimated,
  employee_range,
  website,
  description,
}) => {
  const viewRecord = {
    vat_number,
    reference_code,
    description,
    business_type: duns_number ? null : get(business_type, 'name'),
    trading_names: isEmpty(trading_names) ? NOT_SET_TEXT : trading_names,
    company_number: transformCompanyNumber(company_number),
    turnover: transformTurnover(turnover, is_turnover_estimated, turnover_range),
    number_of_employees: transformNumberOfEmployees(number_of_employees, is_number_of_employees_estimated, employee_range),
    website: transformWebsite(website),
  }

  return pickBy(getDataLabels(viewRecord, aboutLabels))
}
