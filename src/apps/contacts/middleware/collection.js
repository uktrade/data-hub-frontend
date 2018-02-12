const { pick, mapValues, isArray, pickBy, get, isEmpty } = require('lodash')

const { search, facets } = require('../../search/services')
const { transformApiResponseToSearchCollection } = require('../../search/transformers')
const { transformContactToListItem } = require('../transformers')
const removeArray = require('../../../lib/remove-array')

async function getContactsCollection (req, res, next) {
  try {
    const token = req.session.token
    const searchEntity = 'contact'
    const requestBody = req.body

    const name = get(req.query, 'name')
    const companyName = get(req.query, 'company_name')

    res.locals.results = await search({
      token,
      searchEntity,
      requestBody,
      page: req.query.page,
      isAggregation: false,
    })
      .then(transformApiResponseToSearchCollection(
        { query: req.query },
        transformContactToListItem,
      ))

    if (!isEmpty(name) || !isEmpty(companyName)) {
      res.locals.facets = await facets({
        token,
        searchEntity,
        requestBody: {
          name,
          company_name: companyName,
        },
      })
    }

    next()
  } catch (error) {
    next(error)
  }
}

function getRequestBody (req, res, next) {
  const selectedFiltersQuery = removeArray(pick(req.query, [
    'archived',
    'name',
    'company_name',
    'company_sector',
    'address_country',
    'company_uk_region',
  ]), 'archived')

  mapValues(get(selectedFiltersQuery, 'archived'), (value) => {
    return isArray(value) ? null : value
  })

  const selectedSortBy = req.query.sortby
    ? { sortby: req.query.sortby }
    : null

  req.body = Object.assign({}, req.body, selectedSortBy, pickBy(selectedFiltersQuery))

  next()
}

module.exports = {
  getContactsCollection,
  getRequestBody,
}
