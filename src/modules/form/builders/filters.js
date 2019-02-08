const { isEmpty, pickBy, castArray } = require('lodash')

const { getOptions } = require('../../../lib/options') // todo change this dependency

const hydrateFiltersFields = async (token, filtersFields, query) => {
  const getSelectedOptions = async (name, entity, value) => {
    if (entity && !isEmpty(value)) {
      return getOptions(token, entity, {
        id: value,
      })
    }
  }

  return Promise.all(filtersFields.map(async field => {
    const value = query[field.name]
    const selectedOptions = await getSelectedOptions(field.name, field.entity, value)

    return { ...field, value, selectedOptions }
  }))
}

module.exports = {
  hydrateFiltersFields,
}
