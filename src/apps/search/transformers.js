const { find } = require('lodash')

const { transformInvestmentProjectToListItem } = require('../investment-projects/transformers')
const { transformContactToListItem } = require('../contacts/transformers')
const { buildPagination } = require('../../lib/pagination')
const { buildSearchAggregation } = require('./builders')
const { entities } = require('./services')

function transformResultsToCollection (results, searchEntity, options = {}) {
  const resultsItems = results[`${searchEntity}s`] || results.items || results.results
  if (!resultsItems) { return null }

  const entity = find(entities, ['entity', searchEntity])

  let items = resultsItems.map(item => Object.assign({}, item, { type: searchEntity }))

  if (searchEntity === 'investment_project') {
    items = items.map(transformInvestmentProjectToListItem)
  }

  if (searchEntity === 'contact') {
    items = items.map(transformContactToListItem)
  }

  return Object.assign({}, {
    items,
    count: results.count,
    countLabel: entity.noun,
    highlightTerm: options.searchTerm,
    pagination: buildPagination(options.query, results),
    aggregations: buildSearchAggregation(results.aggregations),
  })
}

module.exports = {
  transformResultsToCollection,
}
