const { isPlainObject, isFunction, isEmpty, assign } = require('lodash')

const { buildPagination } = require('../../../lib/pagination') // TODO: We should not be dependent on this

/**
 * @param {object} [options] {object}
 * @param {string} [options.searchTerm] - search term used for highlighting words in collection macro
 * @param {object} [options.query] - URL query object used in pagination
 * @param {...function} [itemTransformers] - an array of transformer functions to apply for each item in the list
 * @returns {object, undefined}
 */
function transformApiResponseToCollection(options = {}, ...itemTransformers) {
  /**
   * @param {object} response - API response object
   * @returns {function}
   */
  return function transformResponseToCollection(response) {
    if (!isPlainObject(response)) {
      return
    }

    let items = response.results || response.items

    if (!items) {
      return
    }

    itemTransformers.forEach((transformer) => {
      if (!isFunction(transformer)) {
        return
      }
      items = items.map(transformer).filter((item) => !isEmpty(item))
    })

    return assign(
      {},
      {
        items,
        count: response.count,
        summary: response.summary,
        pagination: buildPagination(options.query, response),
      }
    )
  }
}

module.exports = transformApiResponseToCollection
