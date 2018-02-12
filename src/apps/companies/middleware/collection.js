const { get, isEmpty, pick, pickBy, assign } = require('lodash')

const { search, searchLimitedCompanies, facets } = require('../../search/services')
const { transformApiResponseToSearchCollection } = require('../../search/transformers')
const {
  transformCompanyToListItem,
  transformCompaniesHouseToListItem,
} = require('../transformers')

async function getCompanyCollection (req, res, next) {
  try {
    const searchTerm = get(req.query, 'name')
    const token = req.session.token
    const searchEntity = 'company'
    const requestBody = req.body

    res.locals.results = await search({
      token,
      searchTerm,
      searchEntity,
      requestBody,
      page: req.query.page,
      isAggregation: false,
    })
      .then(transformApiResponseToSearchCollection(
        { query: req.query },
        transformCompanyToListItem,
      ))

    if (!isEmpty(searchTerm)) {
      res.locals.facets = await facets({
        token,
        searchTerm,
        searchEntity,
      })
    }

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
          transformCompaniesHouseToListItem,
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
    'country',
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
