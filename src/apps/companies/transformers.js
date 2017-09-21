/* eslint-disable camelcase */
const { assign, get } = require('lodash')

function transformCompanyToListItem ({
  id,
  name,
  sector,
  uk_based,
  uk_region,
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
} = {}) {
  if (!id || !name) { return }

  const meta = []
  const isTradingAddress = trading_address_town && trading_address_postcode && trading_address_1
  let address

  if (isTradingAddress) {
    address = [trading_address_1, trading_address_town, trading_address_postcode]
  } else {
    address = [registered_address_1, registered_address_town, registered_address_postcode]
  }

  if (sector) {
    meta.push({
      label: 'Sector',
      value: sector,
    })
  }

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
      value: uk_region,
    })
  }

  if (address) {
    meta.push({
      label: isTradingAddress ? 'Trading address' : 'Registered address',
      value: address.filter(x => x).join(', '),
    })
  }

  const url = companies_house_data ? `/companies/view/ch/${companies_house_data.company_number}` : `/viewcompanyresult/${id}`

  return {
    type: 'company',
    id,
    name,
    url,
    meta,
  }
}

function transformCompaniesHouseCompanyToListItem (props) {
  return assign({}, transformCompanyToListItem(props), {
    meta: [
      {
        label: 'Status',
        value: get(props, 'companies_house_data.company_status'),
        type: 'badge',
      },
      {
        label: 'Company number',
        value: get(props, 'company_number'),
      },
      {
        label: 'Type',
        value: get(props, 'companies_house_data.company_category'),
      },
      {
        label: 'Nature of business (SIC)',
        value: get(props, 'companies_house_data.sic_code_1'),
      },
      {
        label: 'Incorporated on',
        value: get(props, 'companies_house_data.incorporation_date'),
        type: 'date',
      },
    ],
  })
}

module.exports = {
  transformCompanyToListItem,
  transformCompaniesHouseCompanyToListItem,
}
