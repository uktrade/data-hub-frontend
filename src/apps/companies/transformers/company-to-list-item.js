/* eslint-disable camelcase */
const { get, isUndefined, isNull } = require('lodash')

const { getCompanyAddress } = require('./shared')

module.exports = function transformCompanyToListItem ({
  id,
  name,
  sector,
  uk_based,
  uk_region,
  trading_name,
  trading_address_country,
  trading_address_county,
  trading_address_town,
  trading_address_postcode,
  trading_address_1,
  trading_address_2,
  registered_address_country,
  registered_address_county,
  registered_address_town,
  registered_address_postcode,
  registered_address_1,
  registered_address_2,
  companies_house_data,
  modified_on,
  turnover_range,
} = {}) {
  if (!id) { return }

  const defaultValue = 'n/a'
  const url = id ? `/companies/${id}` : `/companies/view/ch/${companies_house_data.company_number}`
  const address = getCompanyAddress({
    trading_address_country,
    trading_address_county,
    trading_address_town,
    trading_address_postcode,
    trading_address_1,
    trading_address_2,
    registered_address_country,
    registered_address_county,
    registered_address_town,
    registered_address_postcode,
    registered_address_1,
    registered_address_2,
  })
  const meta = [
    {
      label: 'Trading name',
      value: trading_name,
    },
    address,
    {
      label: 'Sector',
      value: get(sector, 'name'),
    },
    {
      label: 'Turnover',
      value: turnover_range,
    },
  ]

  if (trading_address_country || registered_address_country) {
    meta.push({
      label: 'Country',
      type: 'badge',
      value: get(trading_address_country, 'name') || get(registered_address_country, 'name'),
    })
  }

  if (uk_based) {
    meta.push({
      label: 'UK region',
      type: 'badge',
      value: get(uk_region, 'name'),
    })
  }

  const metaData = meta.map((metaData) => {
    if (isUndefined(metaData.value) || isNull(metaData.value) || metaData.value === '') {
      metaData.value = defaultValue
    }
    return metaData
  })

  return {
    id,
    name,
    url,
    updated: {
      label: 'Updated',
      type: 'datetime',
      value: modified_on,
    },
    meta: metaData,
    type: 'company',
  }
}
