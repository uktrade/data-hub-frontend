const { pick, pickBy } = require('lodash')

const { search } = require('../../search/services')
const { transformResultsToCollection } = require('../../search/transformers')
const { transformInvestmentListItemToHaveMetaLinks } = require('../transformers')

async function getInvestmentProjectsCollection (req, res, next) {
  const searchEntity = 'investment_project'

  try {
    res.locals.results = await search({
      searchTerm: '',
      searchEntity,
      requestBody: req.body,
      token: req.session.token,
      page: req.query.page,
      isAggregation: false,
    })
      .then(data => transformResultsToCollection(data, searchEntity, {
        query: req.query,
      }))
      .then(data => Object.assign({}, data, {
        items: data.items.map(item => transformInvestmentListItemToHaveMetaLinks(item, req.query)),
      }))

    next()
  } catch (error) {
    next(error)
  }
}

function getRequestBody (req, res, next) {
  const selectedFiltersQuery = pick(req.query, [
    'stage',
    'sector',
    'investment_type',
    'investor_company',
    'estimated_land_date_before',
    'estimated_land_date_after',
    'client_relationship_manager',
  ])

  const selectedSortBy = req.query.sortby ? {
    sortby: req.query.sortby,
  } : null

  req.body = Object.assign({}, req.body, selectedSortBy, pickBy(selectedFiltersQuery))

  next()
}

module.exports = {
  getRequestBody,
  getInvestmentProjectsCollection,
}
