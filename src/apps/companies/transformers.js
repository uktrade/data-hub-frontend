/* eslint-disable camelcase */
const {
  assign,
  find,
  get,
  isPlainObject,
  mapValues,
  capitalize,
} = require('lodash')

const metadataRepository = require('../../lib/metadata')

function transformCompanyToListItem ({
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
} = {}) {
  if (!id && !get(companies_house_data, 'company_number')) { return }

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

  const url = id ? `/companies/${id}` : `/companies/view/ch/${companies_house_data.company_number}`
  const displayName = trading_name || name

  return {
    id,
    url,
    meta,
    type: 'company',
    name: displayName,
  }
}

function transformCompaniesHouseCompanyToListItem ({
  name,
  registered_address_1,
  registered_address_2,
  registered_address_town,
  registered_address_county,
  registered_address_postcode,
  company_number,
  company_category,
  company_status,
  sic_code_1,
  sic_code_2,
  sic_code_3,
  sic_code_4,
  incorporation_date,
}) {
  const address = [
    capitalize(registered_address_1),
    capitalize(registered_address_2),
    capitalize(registered_address_town),
    capitalize(registered_address_county),
    registered_address_postcode,
  ]
    .filter(item => item.length)
    .join(', ')

  const sicCodes = [
    sic_code_1,
    sic_code_2,
    sic_code_3,
    sic_code_4,
  ]
    .filter(item => item.length)
    .join(', ')

  return {
    name: capitalize(name),
    id: company_number,
    type: 'companies_house',
    url: `/view/ch/${company_number}`,
    meta: [
      {
        label: 'Status',
        value: company_status,
        type: 'badge',
      },
      {
        label: 'Company number',
        value: company_number,
      },
      {
        label: 'Type',
        value: company_category,
      },
      {
        label: 'Nature of business (SIC)',
        value: sicCodes,
      },
      {
        label: 'Incorporated on',
        value: incorporation_date,
        type: 'date',
      },
      {
        label: 'Address',
        value: address,
      },
    ],
  }
}

// TODO: This is a temporary transformer to transform an API response into
// a format needed for the form view
//
// Will be replaced with newer form builder transformers once the form view is
// replaced with newer form macros
function transformCompanyResponseToForm (body) {
  if (!isPlainObject(body)) { return }

  const schema = {
    registered_address_country: String,
    trading_address_country: String,
    business_type: String,
    headquarter_type: String,
    uk_region: String,
    sector: String,
    employee_range: String,
    turnover_range: String,
  }

  const formatted = mapValues(schema, (type, key) => {
    return get(body, `${key}.id`)
  })

  // TODO we need to create an "other" business_type on DH to place any Companies House company_category that do not match DH business_type
  if (body.company_category) {
    const businessType = find(metadataRepository.businessTypeOptions, (type) => {
      return type.name.toLowerCase() === body.company_category.toLowerCase()
    })

    formatted.business_type = get(businessType, 'id')
  }

  return assign({}, body, formatted)
}

module.exports = {
  transformCompanyToListItem,
  transformCompaniesHouseCompanyToListItem,
  transformCompanyResponseToForm,
}
