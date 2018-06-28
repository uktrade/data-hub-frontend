const { search } = require('../../search/services')
const { transformApiResponseToSearchCollection } = require('../../search/transformers')
const { transformContactToListItem } = require('../transformers')

async function getContactsCollection (req, res, next) {
  try {
    res.locals.results = await search({
      searchEntity: 'contact',
      requestBody: req.body,
      token: req.session.token,
      page: req.query.page,
      isAggregation: false,
    })
      .then(transformApiResponseToSearchCollection(
        { query: req.query },
        transformContactToListItem,
      ))

    next()
  } catch (error) {
    next(error)
  }
}

module.exports = {
  getContactsCollection,
}
