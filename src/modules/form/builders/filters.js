const qs = require('querystring')
const {
  isEmpty,
  pickBy,
  castArray,
  isFunction,
  find,
  compact,
  isArray,
  filter,
  map,
  get,
} = require('lodash')

const { getOptions } = require('../../../lib/options') // todo change this dependency

const labels = {
  MultipleChoiceField (field, fieldValue) {
    const options = isFunction(field.options) ? field.options() : field.options
    return find(options, (option) => option.value === fieldValue).label
  },
  Typeahead (field, fieldValue) {
    return find(field.selectedOptions, (fieldOption) => fieldOption.value === fieldValue).label
  },
}

const getRemoveHrefQueryString = (query, field, fieldValue) => {
  return pickBy({
    ...query,
    [field.name]: isArray(query[field.name]) ? filter(query[field.name], q => q !== fieldValue) : null,
  })
}

const getFilterLabel = (field, fieldValue) => {
  if (labels[field.macroName]) {
    return labels[field.macroName](field, fieldValue)
  }

  if (isArray(field.value)) {
    return field.value[0]
  }

  return field.value
}

function buildSelectedFiltersSummary (hydratedFiltersFields, query = {}, baseUrl) {
  return compact(map(hydratedFiltersFields, (field) => {
    if (isEmpty(field.value) || field.summarise === false) {
      return
    }

    const filters = map(castArray(field.value), (fieldValue) => {
      return {
        value: fieldValue,
        label: getFilterLabel(field, fieldValue),
        removeHref: `${baseUrl}?${qs.stringify(getRemoveHrefQueryString(query, field, fieldValue))}`,
      }
    })

    if (!isEmpty(filters)) {
      return {
        filters,
        name: field.name,
        label: field.label,
      }
    }
  }))
}

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

const getHighlightTerm = (selectedFiltersSummary, name) => {
  const nameFilterSummary = find(selectedFiltersSummary, (selectedFilter) => selectedFilter.name === name)

  return get(nameFilterSummary, 'filters[0].label')
}

module.exports = {
  buildSelectedFiltersSummary,
  hydrateFiltersFields,
  getHighlightTerm,
}
