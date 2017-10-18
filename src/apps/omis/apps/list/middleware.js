const { assign, pick, pickBy } = require('lodash')

const { search } = require('../../../search/services')
const { transformApiResponseToSearchCollection } = require('../../../search/transformers')
const { transformOrderToListItem, transformOrderToTableItem } = require('../../transformers')

async function setCollectionResults (req, res, next) {
  try {
    res.locals.results = await search({
      searchEntity: 'order',
      requestBody: req.body,
      token: req.session.token,
      page: req.query.page,
      isAggregation: false,
    })
      .then(transformApiResponseToSearchCollection(
        { query: req.query },
        transformOrderToListItem,
      ))

    next()
  } catch (error) {
    next(error)
  }
}

async function setReconciliationResults (req, res, next) {
  try {
    res.locals.results = await search({
      searchEntity: 'order',
      requestBody: req.body,
      token: req.session.token,
      page: req.query.page,
      isAggregation: false,
    })
      .then(transformApiResponseToSearchCollection(
        { query: req.query },
        transformOrderToTableItem,
      ))

    next()
  } catch (error) {
    next(error)
  }
}

function setRequestBody (req, res, next) {
  const selectedSortBy = req.query.sortby ? { sortby: req.query.sortby } : null

  const selectedFiltersQuery = pick(req.query, [
    'status',
    'company_name',
    'contact_name',
    'primary_market',
    'reference',
  ])

  req.body = assign({}, req.body, selectedSortBy, pickBy(selectedFiltersQuery))
  next()
}

module.exports = {
  setCollectionResults,
  setReconciliationResults,
  setRequestBody,
}
