const { size } = require('lodash')

/**
 * Trim whitespace from req.body strings
 * @param obj
 * @returns {*}
 */
function trim (obj) {
  for (let prop in obj) {
    let value = obj[prop]

    if (typeof value === 'string') {
      obj[prop] = value.trim()
    } else if (value instanceof Array) {
      obj[prop] = trim(value)
    }
  }

  return obj
}

module.exports = () => {
  return function trimBodyParams (req, res, next) {
    if (size(req.body)) {
      req.body = trim(Object.assign({}, req.body))
    }

    next()
  }
}
