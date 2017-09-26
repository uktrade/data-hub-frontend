const { search } = require('../../../search/services')
const { transformApiResponseToSearchCollection } = require('../../../search/transformers')
const { transformOrderToListItem } = require('../../transformers')

async function getCollection (req, res, next) {
  try {
    res.locals.results = await search({
      searchEntity: 'order',
      searchTerm: req.query.term,
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

function getRequestBody (req, res, next) {
  const selectedSortBy = req.query.sortby ? { sortby: req.query.sortby } : null

  req.body = Object.assign({}, req.body, selectedSortBy)
  next()
}

module.exports = {
  getCollection,
  getRequestBody,
}
