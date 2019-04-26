/* eslint-disable camelcase */
const {
  assign,
  get,
  isPlainObject,
  mapValues,
} = require('lodash')

// TODO: This is a temporary transformer to transform an API response into
// a format needed for the form view
//
// Will be replaced with newer form builder transformers once the form view is
// replaced with newer form macros
module.exports = function transformCompanyToForm (company) {
  if (!isPlainObject(company)) { return }

  const schema = {
    registered_address_country: String,
    trading_address_country: String,
    business_type: String,
    headquarter_type: Object,
    uk_region: String,
    sector: String,
    employee_range: String,
    turnover_range: String,
  }

  const formatted = mapValues(schema, (type, key) => {
    if (type === Object) {
      return get(company, key)
    }
    return get(company, `${key}.id`)
  })

  formatted.headquarter_type = get(formatted, 'headquarter_type.id', 'not_headquarters')
  formatted.trading_names = company.trading_names && company.trading_names.length ? company.trading_names[0] : null

  formatted.address_1 = get(company.address, 'line_1')
  formatted.address_2 = get(company.address, 'line_2')
  formatted.address_town = get(company.address, 'town')
  formatted.address_county = get(company.address, 'county')
  formatted.address_postcode = get(company.address, 'postcode')
  formatted.address_country = get(company.address, 'country.id')

  return assign({}, company, formatted)
}
