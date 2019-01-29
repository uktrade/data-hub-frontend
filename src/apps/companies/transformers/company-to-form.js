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
module.exports = function transformCompanyToForm (body) {
  if (!isPlainObject(body)) { return }

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
      return get(body, key)
    }
    return get(body, `${key}.id`)
  })

  formatted.headquarter_type = get(formatted, 'headquarter_type.id', 'not_headquarters')
  formatted.trading_names = body.trading_names && body.trading_names.length ? body.trading_names[0] : null

  return assign({}, body, formatted)
}
