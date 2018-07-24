const { search } = require('../../search/services')
const { transformApiResponseToSearchCollection } = require('../../../modules/search/transformers')
const { transformEventToListItem } = require('../transformers')
const { ENTITIES } = require('../../search/constants')

async function getEventsCollection (req, res, next) {
  try {
    res.locals.results = await search({
      searchEntity: 'event',
      requestBody: req.body,
      token: req.session.token,
      page: req.query.page,
      isAggregation: false,
    })
      .then(transformApiResponseToSearchCollection(
        { query: req.query },
        ENTITIES,
        transformEventToListItem,
      ))

    next()
  } catch (error) {
    next(error)
  }
}

module.exports = {
  getEventsCollection,
}
