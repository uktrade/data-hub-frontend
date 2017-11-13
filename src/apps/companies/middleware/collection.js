const { pick, pickBy, assign } = require('lodash')

const { search, searchLimitedCompanies } = require('../../search/services')
const { transformApiResponseToSearchCollection } = require('../../search/transformers')
const {
  transformCompanyToListItem,
  transformCompaniesHouseCompanyToListItem,
} = require('../transformers')

async function getCompanyCollection (req, res, next) {
  try {
    res.locals.results = await search({
      searchEntity: 'company',
      requestBody: req.body,
      token: req.session.token,
      page: req.query.page,
      isAggregation: false,
    })
      .then(transformApiResponseToSearchCollection(
        { query: req.query },
        transformCompanyToListItem,
      ))

    next()
  } catch (error) {
    next(error)
  }
}

async function getLimitedCompaniesCollection (req, res, next) {
  const searchTerm = res.locals.searchTerm = req.query.term

  if (!searchTerm) {
    return next()
  }

  try {
    res.locals.results = await searchLimitedCompanies({
      searchTerm,
      token: req.session.token,
      page: req.query.page,
    })
      .then(
        transformApiResponseToSearchCollection(
          { query: req.query },
          transformCompaniesHouseCompanyToListItem,
          (item) => {
            return assign({}, item, {
              url: `/companies/add/${item.id}`,
            })
          }
        )
      )

    next()
  } catch (error) {
    next(error)
  }
}

function getRequestBody (req, res, next) {
  const selectedFiltersQuery = pick(req.query, [
    'name',
    'sector',
    'trading_address_country',
    'uk_region',
  ])

  const selectedSortBy = req.query.sortby ? {
    sortby: req.query.sortby,
  } : null

  req.body = assign({}, req.body, selectedSortBy, pickBy(selectedFiltersQuery))

  next()
}

module.exports = {
  getRequestBody,
  getCompanyCollection,
  getLimitedCompaniesCollection,
}
