const { search } = require('../search/services')
const { transformApiResponseToSearchCollection } = require('../search/transformers')
const { transformInteractionToListItem } = require('./transformers')

async function getInteractionsCollection (req, res, next) {
  try {
    res.locals.results = await search({
      searchEntity: 'interaction',
      requestBody: req.body,
      token: req.session.token,
      page: req.query.page,
      isAggregation: false,
    })
      .then(transformApiResponseToSearchCollection(
        { query: req.query },
        transformInteractionToListItem,
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
  getInteractionsCollection,
  getRequestBody,
}
