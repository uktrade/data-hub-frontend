/* eslint-disable camelcase */
const Case = require('case')
const { pickBy } = require('lodash')

const { formatLongDate } = require('../../../../common/date')
const { getFormattedAddress } = require('../../../lib/address')
const { getDataLabels } = require('../../../lib/controller-utils')
const { transformSicCodes } = require('./shared')
const { chDetailsLabels } = require('../labels')

module.exports = function transformCompaniesHouseToView ({
  name,
  registered_address_1,
  registered_address_2,
  registered_address_town,
  registered_address_county,
  registered_address_postcode,
  registered_address_country,
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
    registered_address: getFormattedAddress({
      address_1: registered_address_1,
      address_2: registered_address_2,
      address_town: registered_address_town,
      address_county: registered_address_county,
      address_postcode: registered_address_postcode,
      address_country: registered_address_country,
    }),
    incorporation_date: formatLongDate(incorporation_date),
    sic_code: transformSicCodes({ sic_code_1, sic_code_2, sic_code_3, sic_code_4 }),
  }

  return pickBy(getDataLabels(viewRecord, chDetailsLabels))
}
