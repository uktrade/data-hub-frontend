const { search } = require('../../search/services')
const { transformApiResponseToSearchCollection } = require('../../search/transformers')
const {
  transformInvestmentProjectToListItem,
} = require('../transformers')

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
