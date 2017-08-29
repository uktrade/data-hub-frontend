const { get } = require('lodash')

const { transformApiResponseToCollection } = require('../transformers')
const { buildSearchAggregation } = require('./builders')

/**
 * @param {object} [options] {object}
 * @param {string} [options.entityType] - API entity type
 * @param {string} [options.searchTerm] - search term used for highlighting words in collection macro
 * @param {object} [options.query] - URL query object used in pagination
 * @param {...function} [itemTransformers] - an array of transformer functions to apply for each item in the list
 * @returns {object, undefined}
 */
function transformApiResponseToSearchCollection (options = {}, ...itemTransformers) {
  /**
   * @param {object} response - API response object
   * @returns {function}
   */
  return function transformResponseToCollection (response) {
    if (!response) { return }

    const collection = transformApiResponseToCollection(options, ...itemTransformers)(response)

    return Object.assign({}, collection, {
      highlightTerm: get(options, 'searchTerm'),
      aggregations: buildSearchAggregation(response.aggregations),
    })
  }
}

module.exports = {
  transformApiResponseToSearchCollection,
}
