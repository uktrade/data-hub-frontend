/* eslint-disable camelcase */
const { get, pickBy, isEmpty } = require('lodash')

const { aboutLabels } = require('../labels')
const { getDataLabels } = require('../../../lib/controller-utils')
const { NOT_SET_TEXT } = require('../constants')

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
function transformTurnover (turnover, turnover_range) {
  if (turnover) {
    return [
      `USD ${turnover}`,
      {
        name: 'This is an estimated number',
        type: 'details',
        details: {
          summaryText: 'What does that mean?',
          text: 'This is an estimated number',
        },
      },
    ]
  }

  if (turnover_range) {
    return turnover_range.name
  }

  return NOT_SET_TEXT
}

function transformNumberOfEmployees (number_of_employees, employee_range) {
  if (number_of_employees) {
    return [
      {
        name: number_of_employees,
        type: 'number',
      },
      {
        name: 'This is an estimated number',
        type: 'details',
        details: {
          summaryText: 'What does that mean?',
          text: 'This is an estimated number',
        },
      },
    website: isEmpty(website) ? NOT_AVAILABLE_TEXT : {
      name: website,
      url: website,
      hint: '(Opens in a new window)',
      hintId: 'external-link-label',
      newWindow: true,
    },
    ]
  }

  if (employee_range) {
    return employee_range.name
  }

  return NOT_SET_TEXT
}

module.exports = ({
  vat_number,
  duns_number,
  business_type,
  trading_names,
  companies_house_data,
  turnover,
  turnover_range,
  number_of_employees,
  employee_range,
  website,
}) => {
  const company_number = get(companies_house_data, 'company_number')

  const viewRecord = {
    vat_number,
    business_type: duns_number ? null : get(business_type, 'name'),
    trading_names: isEmpty(trading_names) ? NOT_SET_TEXT : trading_names,
    turnover: transformTurnover(turnover, turnover_range),
    number_of_employees: transformNumberOfEmployees(number_of_employees, employee_range),
  }

  return pickBy(getDataLabels(viewRecord, aboutLabels))
}
