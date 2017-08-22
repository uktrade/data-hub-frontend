const { get, isString, isArray } = require('lodash')
const { transformObjectToOption } = require('../transformers')
const metadataRepo = require('../../lib/metadata')
const { collectionFilterLabels } = require('./labels')

function buildInvestmentFilters (filtersQuery = {}) {
  const formOptions = {
    stage: metadataRepo.investmentStageOptions.map(transformObjectToOption),
    investment_type: metadataRepo.investmentTypeOptions.map(transformObjectToOption),
    sector: metadataRepo.sectorOptions.map(transformObjectToOption),
  }

  return Object.keys(collectionFilterLabels.edit).reduce((filtersObj, filterName) => {
    const filterOptions = formOptions[filterName] || []

    let valueLabel = filtersQuery[filterName]
    let valuesArray = []

    if (isArray(valueLabel)) {
      valuesArray = valueLabel
    }
    if (isString(valueLabel)) {
      valuesArray = valueLabel.split(',')
    }

    filtersObj[filterName] = {
      value: filtersQuery[filterName],
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

module.exports = {
  buildInvestmentFilters,
}
