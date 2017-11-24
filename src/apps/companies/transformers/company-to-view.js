/* eslint-disable camelcase */
const { get, pickBy } = require('lodash')

const { getFormattedAddress } = require('../../../lib/address')
const { getPrimarySectorName } = require('../../../../common/transform-sectors')
const { getDataLabels } = require('../../../lib/controller-utils')
const { companyDetailsLabels, hqLabels } = require('../labels')

module.exports = function transformCompanyToView ({
  uk_based,
  uk_region,
  sector,
  description,
  website,
  employee_range,
  turnover_range,
  account_manager,
  headquarter_type,
  trading_name,
  vat_number,
  reference_code,
  registered_address_1,
  registered_address_2,
  registered_address_town,
  registered_address_county,
  registered_address_postcode,
  registered_address_country,
  trading_address_1,
  trading_address_2,
  trading_address_town,
  trading_address_county,
  trading_address_postcode,
  trading_address_country,
  companies_house_data,
  business_type,
}) {
  const viewRecord = {
    trading_name,
    vat_number,
    reference_code,
    description,
    uk_region: get(uk_region, 'name'),
    sector: getPrimarySectorName(get(sector, 'name')),
    website: (website && website.length > 0) ? {
      name: website,
      url: website,
    } : null,
    employee_range: get(employee_range, 'name'),
    turnover_range: get(turnover_range, 'name'),
    account_manager: get(account_manager, 'name'),
    headquarter_type: hqLabels[get(headquarter_type, 'name')] || 'Not a headquarters',
    registered_address: getFormattedAddress({
      address_1: registered_address_1,
      address_2: registered_address_2,
      address_town: registered_address_town,
      address_county: registered_address_county,
      address_postcode: registered_address_postcode,
      address_country: registered_address_country,
    }),
    country: !uk_based ? get(registered_address_country, 'name') : null,
    trading_address: getFormattedAddress({
      address_1: trading_address_1,
      address_2: trading_address_2,
      address_town: trading_address_town,
      address_county: trading_address_county,
      address_postcode: trading_address_postcode,
      address_country: trading_address_country,
    }),
    business_type: !companies_house_data ? get(business_type, 'name') : null,
  }

  return pickBy(getDataLabels(viewRecord, companyDetailsLabels))
}
