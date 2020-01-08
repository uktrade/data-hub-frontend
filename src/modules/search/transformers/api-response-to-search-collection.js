const { get, assign } = require('lodash')

const { transformApiResponseToCollection } = require('../../api/transformers')
const { buildSearchAggregation } = require('../builders')

/**
 * @param {object} [options] {object}
 * @param {string} [options.searchTerm] - search term used for highlighting words in collection macro
 * @param {object} [options.query] - URL query object used in pagination
 * @param {...function} [itemTransformers] - an array of transformer functions to apply for each item in the list
 * @returns {object, undefined}
 */
function transformApiResponseToSearchCollection(
  options = {},
  entityDetails,
  ...itemTransformers
) {
  /**
   * @param {object} response - API response object
   * @returns {function}
   */
  return function transformResponseToCollection(response) {
    if (!response) {
      return
    }

    const collection = transformApiResponseToCollection(
      options,
      ...itemTransformers
    )(response)
    const aggregations = buildSearchAggregation({
      entityDetails,
      aggregations: response.aggregations,
      userPermissions: get(options, 'userPermissions'),
    })

    return assign({}, collection, {
      aggregations,
      highlightTerm: get(options, 'searchTerm'),
    })
  }
}

module.exports = transformApiResponseToSearchCollection
