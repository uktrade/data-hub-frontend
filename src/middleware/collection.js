const { pick, pickBy } = require('lodash')

const removeArray = require('../lib/remove-array')

function getRequestBody(queryFields, queryDateFields = []) {
  return function (req, res, next) {
    req.query.area = []
    if (req.query.us_state) {
      req.query.area = req.query.area.concat(req.query.us_state)
    }
    if (req.query.canadian_province) {
      req.query.area = req.query.area.concat(req.query.canadian_province)
    }

    const selectedFiltersQuery = removeArray(
      pick(req.query, queryFields.concat(queryDateFields)),
      'archived'
    )

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
