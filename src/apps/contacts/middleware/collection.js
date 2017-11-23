const { pick, mapValues, isArray, pickBy, get } = require('lodash')

const { search } = require('../../search/services')
const { transformApiResponseToSearchCollection } = require('../../search/transformers')
const { transformContactToListItem } = require('../transformers')
const removeArray = require('../../../lib/remove-array')

async function getContactsCollection (req, res, next) {
  try {
    res.locals.results = await search({
      searchEntity: 'contact',
      requestBody: req.body,
      token: req.session.token,
      page: req.query.page,
      isAggregation: false,
    })
      .then(transformApiResponseToSearchCollection(
        { query: req.query },
        transformContactToListItem,
      ))

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
