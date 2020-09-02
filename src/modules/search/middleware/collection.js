const { search, exportSearch } = require('../services')
const { transformApiResponseToSearchCollection } = require('../transformers')

function getCollection(searchEntity, entityDetails, ...itemTransformers) {
  return async function (req, res, next) {
    try {
      res.locals.results = await search({
        searchEntity,
        requestBody: req.body,
        req,
        page: req.query.page,
        isAggregation: false,
      }).then(
        transformApiResponseToSearchCollection(
          { query: req.query },
          entityDetails,
          ...itemTransformers
        )
      )

      next()
    } catch (error) {
      next(error)
    }
  }
}

function exportCollection(searchEntity) {
  return async function (req, res, next) {
    return exportSearch({
      searchEntity,
      requestBody: req.body,
      req,
    })
      .then((apiReq) => {
        return apiReq.pipe(res)
      })
      .catch((error) => {
        return next(error)
      })
  }
}

module.exports = {
  exportCollection,
  getCollection,
}
