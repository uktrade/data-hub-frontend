/* eslint-disable camelcase */
const { get } = require('lodash')

const ADDRESS_TYPE = {
  ADDRESS: 1,
  REGISTERED: 2,
}

const transformAddress = (address, addressType) => {
  const prefix = addressType === ADDRESS_TYPE.ADDRESS ? '' : 'registered_'
  return {
    [`${prefix}address_1`]: get(address, 'line_1'),
    [`${prefix}address_2`]: get(address, 'line_2'),
    [`${prefix}address_town`]: get(address, 'town'),
    [`${prefix}address_county`]: get(address, 'county'),
    [`${prefix}address_postcode`]: get(address, 'postcode'),
    [`${prefix}address_country`]: get(address, 'country.id'),
  }
}

module.exports = function transformCompanyToForm ({
  name,
  uk_based,
  uk_region,
  sector,
  description,
  website,
  employee_range,
  turnover_range,
  headquarter_type,
  trading_names,
  vat_number,
  reference_code,
  address,
  registered_address,
  business_type,
  global_headquarters,
  company_number,
}) {
  return {
    name,
    uk_based,
    description,
    website,
    vat_number,
    reference_code,
    global_headquarters,
    company_number,
    ...transformAddress(address, ADDRESS_TYPE.ADDRESS),
    ...transformAddress(registered_address, ADDRESS_TYPE.REGISTERED),
    business_type: get(business_type, 'id'),
    headquarter_type: get(headquarter_type, 'id', 'not_headquarters'),
    uk_region: get(uk_region, 'id'),
    sector: get(sector, 'id'),
    employee_range: get(employee_range, 'id'),
    turnover_range: get(turnover_range, 'id'),
    trading_names: trading_names && !!trading_names.length ? trading_names[0] : null,
  }
}
