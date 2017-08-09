const { pick, isEmpty, pickBy } = require('lodash')
const queryString = require('query-string')

const { buildPagination } = require('../../../lib/pagination')
const { searchInvestmentProjects } = require('../../search/services')
const {
  transformInvestmentProjectToListItem,
  transformInvestmentListItemToHaveMetaLinks,
} = require('../transformers')

function handleDefaultFilters (req, res, next) {
  const currentYear = (new Date()).getFullYear()
  const defaultQuery = {
    estimated_land_date_after: `${currentYear}-04-05`,
    estimated_land_date_before: `${currentYear + 1}-04-06`,
  }

  if (isEmpty(req.query)) {
    return res.redirect(`${req.baseUrl}?${queryString.stringify(defaultQuery)}`)
  }

  next()
}

async function getInvestmentProjectsCollection (req, res, next) {
  const page = parseInt(req.query.page, 10) || 1

  try {
    res.locals.results = await searchInvestmentProjects({
      token: req.session.token,
      requestBody: req.body,
      limit: 10,
      page,
    })
      .then(result => {
        result.items = result.items
          .map(transformInvestmentProjectToListItem)
          .map(item => transformInvestmentListItemToHaveMetaLinks(item, req.body))
        result.pagination = buildPagination(req.query, result)
        return result
      })

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
  ])

  const selectedSortBy = req.query.sortby ? {
    sortby: req.query.sortby,
  } : null

  req.body = Object.assign({}, req.body, selectedSortBy, pickBy(selectedFiltersQuery))

  next()
}

module.exports = {
  handleDefaultFilters,
  getRequestBody,
  getInvestmentProjectsCollection,
}
