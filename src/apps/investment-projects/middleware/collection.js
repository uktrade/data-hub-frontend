const { pick, pickBy } = require('lodash')

const { buildPagination } = require('../../../lib/pagination')
const { searchInvestmentProjects } = require('../../search/services')
const { transformFieldsObjectToMacrosObject } = require('../../transformers')
const {
  transformInvestmentProjectToListItem,
  transformInvestmentListItemToHaveMetaLinks,
} = require('../transformers')

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
          .map(item => {
            item.meta = transformFieldsObjectToMacrosObject(item.meta, {
              macroName: 'MetaItem',
            })
            return item
          })
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
