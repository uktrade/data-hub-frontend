const { get } = require('lodash')
/**
 * Simple util to hold store items in the session under a namespace
 * @returns {store}
 */
module.exports = () => {
  return function store (req, res, next) {
    req.session.store = req.session.store || {}

    req.store = (key, item) => {
      req.session.store[key] = item
    }

    req.store.get = (key) => {
      return get(req, `session.store['${key}']`)
    }

    req.store.remove = (key) => {
      delete req.session.store[key]
    }

    next()
  }
}
