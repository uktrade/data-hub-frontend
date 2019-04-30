/* eslint-disable camelcase */
const Case = require('case')
const { pickBy } = require('lodash')

const { formatLongDate } = require('../../../../common/date')
const { getDataLabels } = require('../../../lib/controller-utils')
const { transformSicCodes } = require('./shared')
const { chDetailsLabels } = require('../labels')

module.exports = function transformCompaniesHouseToView ({
  name,
  registered_address,
  company_number,
  company_category,
  company_status,
  sic_code_1,
  sic_code_2,
  sic_code_3,
  sic_code_4,
  incorporation_date,
} = {}) {
  const viewRecord = {
    company_number,
    company_status,
    name: Case.title(name),
    business_type: company_category,
    registered_address: {
      type: 'address',
      address: registered_address,
    },
    incorporation_date: formatLongDate(incorporation_date),
    sic_code: transformSicCodes({ sic_code_1, sic_code_2, sic_code_3, sic_code_4 }),
  }

  return pickBy(getDataLabels(viewRecord, chDetailsLabels))
}
