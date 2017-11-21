const { assign, pick, mapValues, isArray } = require('lodash')
/**
 * Utility to make an array null. Used for removing arrays from query params
 * @param queryObj
 * @param replace
 */
function removeArray (queryObj, replace) {
  return assign({}, queryObj, mapValues(pick(queryObj, replace), (value) => {
    return isArray(value) ? null : value
  }))
}

module.exports = removeArray
