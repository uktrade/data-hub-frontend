const { pick, pickBy } = require('lodash')

const removeArray = require('../lib/remove-array')

function getRequestBody (queryFields) {
  return function (req, res, next) {
    const selectedFiltersQuery = removeArray(pick(req.query, queryFields), 'archived')

    const selectedSortBy = req.query.sortby
      ? { sortby: req.query.sortby }
      : null

    req.body = {
      ...req.body,
      ...selectedSortBy,
      ...pickBy(selectedFiltersQuery),
    }

    next()
  }
}

module.exports = {
  getRequestBody,
}
