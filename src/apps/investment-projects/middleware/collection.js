const { search } = require('../../search/services')
const { transformApiResponseToSearchCollection } = require('../../../modules/search/transformers')
const { transformInvestmentProjectToListItem } = require('../transformers')
const { ENTITIES } = require('../../search/constants')

async function getInvestmentProjectsCollection (req, res, next) {
  try {
    res.locals.results = await search({
      searchEntity: 'investment_project',
      requestBody: req.body,
      token: req.session.token,
      page: req.query.page,
      isAggregation: false,
    })
      .then(transformApiResponseToSearchCollection(
        { query: req.query },
        ENTITIES,
        transformInvestmentProjectToListItem,
      ))

    next()
  } catch (error) {
    next(error)
  }
}

module.exports = {
  getInvestmentProjectsCollection,
}
