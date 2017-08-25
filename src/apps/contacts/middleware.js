const { pick, pickBy } = require('lodash')

const { search } = require('../search/services')
const { transformResultsToCollection } = require('../search/transformers')

async function getContactsCollection (req, res, next) {
  const searchEntity = 'contact'

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

    next()
  } catch (error) {
    next(error)
  }
}

function getRequestBody (req, res, next) {
  const selectedFiltersQuery = pick(req.query, [
    'company_name',
    'company_sector',
    'address_country',
    'company_uk_region',
  ])

  const selectedSortBy = req.query.sortby ? { sortby: req.query.sortby } : null

  req.body = Object.assign({}, req.body, selectedSortBy, pickBy(selectedFiltersQuery))

  next()
}

module.exports = {
  getContactsCollection,
  getRequestBody,
}
