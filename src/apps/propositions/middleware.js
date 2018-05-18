const { search } = require('../search/services')
const { transformApiResponseToSearchCollection } = require('../search/transformers')
const { transformPropositionToListItem } = require('./transformers')

async function getPropositionsCollection (req, res, next) {
  console.log('||||||||||||| getPropositionsCollection ||||||||||||||')
  try {
    res.locals.results = await search({
      searchEntity: 'proposition',
      requestBody: req.body,
      token: req.session.token,
      page: req.query.page,
      isAggregation: false,
    })
      .then(transformApiResponseToSearchCollection(
        { query: req.query },
        transformPropositionToListItem,
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
  getPropositionsCollection,
  getRequestBody,
}
