/* eslint-disable camelcase */
const { get, pickBy, isNull } = require('lodash')

const { getPrimarySectorName } = require('../../../../common/transform-sectors')
const { getDataLabels } = require('../../../lib/controller-utils')
const { companyDetailsLabels, hqLabels } = require('../labels')

const setGlobalHQLink = ({ companyId, ghqDetail }) => {
  const linkTheGlobalHQ = {
    url: `/companies/${companyId}/hierarchies/ghq/search`,
    name: 'Link the Global HQ',
  }

  const linkToTheGlobalHQ = {
    url: `/companies/${get(ghqDetail, 'id')}`,
    name: get(ghqDetail, 'name'),
    actions: [
      {
        url: `/companies/${companyId}/hierarchies/ghq/remove`,
        label: 'Remove link',
      },
    ],
  }

  return isNull(ghqDetail) ? linkTheGlobalHQ : linkToTheGlobalHQ
}

module.exports = function transformCompanyToView ({
  id,
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
  business_type,
  global_headquarters,
}) {
  const viewRecord = {
    trading_names: trading_names && trading_names.length ? trading_names : null,
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
    headquarter_type: hqLabels[get(headquarter_type, 'name')] || 'Not a headquarters',
    registered_address: registered_address_country ? {
      type: 'address',
      address: {
        line_1: registered_address_1,
        line_2: registered_address_2,
        town: registered_address_town,
        county: registered_address_county,
        postcode: registered_address_postcode,
        country: registered_address_country,
      },
    } : null,
    country: !uk_based ? get(registered_address_country, 'name') : null,
    trading_address: trading_address_country ? {
      type: 'address',
      address: {
        line_1: trading_address_1,
        line_2: trading_address_2,
        town: trading_address_town,
        county: trading_address_county,
        postcode: trading_address_postcode,
        country: trading_address_country,
      },
    } : null,
    business_type: get(business_type, 'name'),
  }

  if (get(headquarter_type, 'name') !== 'ghq') {
    viewRecord.global_headquarters = setGlobalHQLink({
      companyId: id,
      ghqDetail: global_headquarters,
    })
  }

  return pickBy(getDataLabels(viewRecord, companyDetailsLabels))
}
