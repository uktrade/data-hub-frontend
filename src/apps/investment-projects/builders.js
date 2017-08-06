const { get, isString, isArray, map, pick, assign } = require('lodash')
const { transformObjectToOption } = require('../transformers')
const metadataRepo = require('../../lib/metadata')
const { collectionFilterLabels } = require('./labels')

function buildInvestmentFilters (originalQuery = {}, user = {}) {
  const formOptions = {
    stage: metadataRepo.investmentStageOptions.map(transformObjectToOption),
    investment_type: metadataRepo.investmentTypeOptions.map(transformObjectToOption),
    sector: metadataRepo.sectorOptions.map(transformObjectToOption),
    client_relationship_manager: [
      transformObjectToOption(user),
    ],
  }

  return Object.keys(collectionFilterLabels.edit).reduce((filtersObj, filterName) => {
    const filterOptions = formOptions[filterName] || []

    let valueLabel = originalQuery[filterName]
    let valuesArray = []

    if (isArray(valueLabel)) {
      valuesArray = valueLabel
    }
    if (isString(valueLabel)) {
      valuesArray = valueLabel.split(',')
    }

    filtersObj[filterName] = {
      value: originalQuery[filterName],
    }

    if (filterOptions.length) {
      filtersObj[filterName].options = filterOptions
      const selectedOptions = filterOptions.filter(x => valuesArray.includes(x.value))

      if (selectedOptions.length) {
        valueLabel = selectedOptions.map(option => option.label).join(', ')
      }
    }

    filtersObj[filterName].label = get(collectionFilterLabels.edit, filterName, filterName)
    filtersObj[filterName].valueLabel = valueLabel

    return filtersObj
  }, {})
}

function buildInvestmentSorting (originalQuery = {}) {
  const options = [
    { value: 'estimated_land_date:asc', label: 'Estimated land date: nearest first' },
    { value: 'estimated_land_date:desc', label: 'Estimated land date: latest first' },
    { value: 'project_code', label: 'Project code' },
    { value: 'name:asc', label: 'Project name' },
    { value: 'stage.name', label: 'Stage' },
    { value: 'total_investment:desc', label: 'Investment value: high to low' },
    { value: 'total_investment:asc', label: 'Investment value: low to high' },
  ]

  const query = Object.assign(
    {},
    { sortby: options[0].value },
    originalQuery
  )

  return {
    options,
    selected: query.sortby,
  }
}

function buildInvestmentFiltersMacroConfig (filters) {
  return map(filters, (filterObj, filterName) => {
    const filterProps = pick(filterObj, ['value', 'label', 'options'])
    const sharedProps = assign({}, filterProps, {
      name: filterName,
      modifier: ['light', 'smaller'],
    })

    switch (filterName) {
      case 'client_relationship_manager':
        return {
          MultipleChoiceField: assign(sharedProps, {
            type: 'checkbox',
          }),
        }
      case 'stage':
        return {
          MultipleChoiceField: assign(sharedProps, {
            type: 'checkbox',
          }),
        }
      case 'investment_type':
        return {
          MultipleChoiceField: assign(sharedProps, {
            type: 'checkbox',
          }),
        }
      case 'sector':
        return {
          MultipleChoiceField: assign(sharedProps, {
            initialOption: 'All sectors',
          }),
        }
      case 'estimated_land_date_before':
        return {
          TextField: assign(sharedProps, {
            placeholder: 'e.g. 2018-07-18',
            hint: 'YYYY-MM-DD',
          }),
        }
      case 'estimated_land_date_after':
        return {
          TextField: assign(sharedProps, {
            placeholder: 'e.g. 2018-07-18',
            hint: 'YYYY-MM-DD',
          }),
        }
    }
  }).filter(x => x)
}

module.exports = {
  buildInvestmentFilters,
  buildInvestmentSorting,
  buildInvestmentFiltersMacroConfig,
}
