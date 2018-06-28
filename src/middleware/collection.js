const { pick, pickBy } = require('lodash')

const removeArray = require('../lib/remove-array')
const { search } = require('../modules/search/services')
const { transformApiResponseToSearchCollection } = require('../modules/search/transformers')

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

function getCollection (searchEntity, ...itemTransformers) {
  return async function (req, res, next) {
    try {
      res.locals.results = await search({
        searchEntity: searchEntity,
        requestBody: req.body,
        token: req.session.token,
        page: req.query.page,
        isAggregation: false,
      }).then(transformApiResponseToSearchCollection({ query: req.query }, ...itemTransformers))

      next()
    } catch (error) {
      next(error)
    }
  }
}

module.exports = {
  getRequestBody,
  getCollection,
}
