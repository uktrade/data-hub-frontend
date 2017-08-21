const { pick, pickBy } = require('lodash')

const { searchInvestmentProjects } = require('../../search/services')
const { transformInvestmentProjectsResultsToCollection } = require('../transformers')

async function getInvestmentProjectsCollection (req, res, next) {
  try {
    res.locals.results = await searchInvestmentProjects({
      token: req.session.token,
      requestBody: req.body,
      limit: 10,
      page: parseInt(req.query.page, 10) || 1,
    })
      .then(result => transformInvestmentProjectsResultsToCollection(result, req.query, true))

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
