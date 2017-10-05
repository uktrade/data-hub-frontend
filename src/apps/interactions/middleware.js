const { search } = require('../search/services')
const { transformApiResponseToSearchCollection } = require('../search/transformers')
const { transformInteractionToListItem } = require('./transformers')
const { fetchInteraction } = require('./repos')

async function getDetails (req, res, next) {
  try {
    const token = req.session.token
    if (req.params.interactionId && req.params.interactionId !== 'add') {
      res.locals.interaction = await fetchInteraction(token, req.params.interactionId)
    }
  } catch (error) {
    return next(error)
  }

  next()
}

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
  getDetails,
  getInteractionsCollection,
  getRequestBody,
}
