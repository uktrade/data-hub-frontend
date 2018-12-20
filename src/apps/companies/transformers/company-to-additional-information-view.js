/* eslint-disable camelcase */
const { pickBy, isEmpty } = require('lodash')

const { additionalBusinessInformationLabels } = require('../labels')
const { getDataLabels } = require('../../../lib/controller-utils')

const NOT_AVAILABLE_TEXT = 'Not available'

module.exports = ({
  website,
  number_of_employees,
  turnover,
}) => {
  const viewRecord = {
    turnover: turnover ? `USD ${turnover}` : NOT_AVAILABLE_TEXT,
    number_of_employees: number_of_employees || NOT_AVAILABLE_TEXT,
    websites: isEmpty(website) ? NOT_AVAILABLE_TEXT : {
      name: website,
      url: website,
      hint: '(Opens in a new window)',
      hintId: 'external-link-label',
      newWindow: true,
    },
  }

  return pickBy(getDataLabels(viewRecord, additionalBusinessInformationLabels))
}
