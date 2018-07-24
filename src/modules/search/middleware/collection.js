const { search } = require('../services')
const { transformApiResponseToSearchCollection } = require('../transformers')

function getCollection (searchEntity, entityDetails, ...itemTransformers) {
  return async function (req, res, next) {
    try {
      res.locals.results = await search({
        searchEntity: searchEntity,
        requestBody: req.body,
        token: req.session.token,
        page: req.query.page,
        isAggregation: false,
      }).then(transformApiResponseToSearchCollection({ query: req.query }, entityDetails, ...itemTransformers))

      next()
    } catch (error) {
      next(error)
    }
  }
}

module.exports = {
  getCollection,
}
