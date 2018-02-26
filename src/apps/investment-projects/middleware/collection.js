const { get, keys, pick, pickBy, isEmpty } = require('lodash')

const { searchInvestments, facets } = require('../../search/services')
const { transformApiResponseToSearchCollection } = require('../../search/transformers')
const {
  transformInvestmentProjectToListItem,
} = require('../transformers')

async function getInvestmentProjectsCollection (req, res, next) {
  try {
    const searchTerm = get(req.query, 'term')
    const token = req.session.token
    const searchEntity = 'investment_project'

    const filters = pick(req.query, [
      'stage',
      'sector',
      'investment_type',
      'investor_company',
      'estimated_land_date_before',
      'estimated_land_date_after',
      'actual_land_date_before',
      'actual_land_date_after',
      'client_relationship_manager',
      'status',
      'uk_region_location',
      'investor_company_country',
    ])

    res.locals.results = await searchInvestments({
      token,
      searchTerm,
      filters,
      page: req.query.page,
    })
      .then(transformApiResponseToSearchCollection(
        { query: req.query },
        transformInvestmentProjectToListItem,
      ))

    const baseFilters = pick(req.query, [
      'estimated_land_date_before',
      'estimated_land_date_after',
      'actual_land_date_before',
      'actual_land_date_after',
    ])

    if (keys(baseFilters).length > 0 || !isEmpty(searchTerm)) {
      const { results } = await searchInvestments({
        token,
        searchTerm,
        filters,
        page: req.query.page,
        limit: 10000,
      })

      res.locals.facets = await facets({ searchEntity, results })
    }

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
    'actual_land_date_before',
    'actual_land_date_after',
    'client_relationship_manager',
    'status',
    'uk_region_location',
    'investor_company_country',
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
