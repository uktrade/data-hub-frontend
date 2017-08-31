/* eslint-disable camelcase */
const { keyBy, snakeCase, isPlainObject, isFunction } = require('lodash')

const { buildPagination } = require('../lib/pagination')

function transformObjectToOption ({ id, name }) {
  return {
    value: id,
    label: name,
  }
}

function transformStringToOption (string) {
  return {
    value: string,
    label: string,
  }
}

function transformContactToOption ({ id, first_name, last_name }) {
  return {
    value: id,
    label: `${first_name} ${last_name}`,
  }
}

function transformIdToObject (id) {
  return {
    id,
  }
}

/**
 * Utility to build an object from a transformed metadata array of objects so you can reference properties
 * by key rather than array index. Helpful when the array length changes.
 * @returns {{}}
 */
function buildMetaDataObj (collection) {
  return keyBy(collection, (elem) => {
    return snakeCase(elem.label)
  })
}

/**
 * @param {object} [options] {object}
 * @param {string} [options.searchTerm] - search term used for highlighting words in collection macro
 * @param {object} [options.query] - URL query object used in pagination
 * @param {...function} [itemTransformers] - an array of transformer functions to apply for each item in the list
 * @returns {object, undefined}
 */
function transformApiResponseToCollection (options = {}, ...itemTransformers) {
  /**
   * @param {object} response - API response object
   * @returns {function}
   */
  return function transformResponseToCollection (response) {
    if (!isPlainObject(response)) { return }

    let items = response.results || response.items

    if (!items) { return }

    itemTransformers.forEach(transformer => {
      if (!isFunction(transformer)) { return }
      items = items.map(transformer)
    })

    return Object.assign({}, {
      items,
      count: response.count,
      pagination: buildPagination(options.query, response),
    })
  }
}

module.exports = {
  buildMetaDataObj,
  transformObjectToOption,
  transformStringToOption,
  transformContactToOption,
  transformIdToObject,
  transformApiResponseToCollection,
}
