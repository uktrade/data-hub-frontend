const { get, isString, isArray } = require('lodash')
const { transformObjectToOption } = require('../transformers')
const metadataRepo = require('../../lib/metadata')
const { collectionFilterLabels } = require('./labels')

function buildInvestmentFilters (originalQuery = {}) {
  const formOptions = {
    stage: metadataRepo.investmentStageOptions.map(transformObjectToOption),
    investment_type: metadataRepo.investmentTypeOptions.map(transformObjectToOption),
    sector: metadataRepo.sectorOptions.map(transformObjectToOption),
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

module.exports = {
  buildInvestmentFilters,
  buildInvestmentSorting,
}
