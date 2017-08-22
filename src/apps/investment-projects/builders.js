const { keyBy, at, isArray, isString, isFunction } = require('lodash')
const { investmentFiltersFields } = require('./macros')

function buildSelectedInvestmentFiltersSummary (query = {}) {
  if (!isArray(investmentFiltersFields)) { return }

  return investmentFiltersFields
    .map(field => {
      field.value = query[field.name]
      return field
    })
    .filter(field => field.value)
    .reduce((fieldsObj, field) => {
      fieldsObj[field.name] = {
        label: field.label,
        valueLabel: field.value,
      }

      const fieldValues = isString(field.value) ? field.value.split(',') : field.value
      const fieldOptions = isFunction(field.options) ? field.options() : field.options

      if (fieldOptions) {
        const selectedValues = at(keyBy(fieldOptions, 'value'), fieldValues).filter(x => x)
        fieldsObj[field.name].valueLabel = selectedValues.map(x => x.label).join(', ')
      }

      return fieldsObj
    }, {})
}

module.exports = {
  buildSelectedInvestmentFiltersSummary,
}
