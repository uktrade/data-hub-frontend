const { pick, pickBy, assign, keys, get } = require('lodash')

const { search, facets } = require('../../search/services')
const { transformApiResponseToSearchCollection } = require('../../search/transformers')
const { transformEventToListItem } = require('../transformers')

async function getEventsCollection (req, res, next) {
  try {
    const searchTerm = get(req.query, 'term')
    const token = req.session.token
    const searchEntity = 'event'
    const requestBody = req.body
    const currentAdviserId = req.session.user.id

    res.locals.results = await search({
      searchTerm,
      token,
      searchEntity,
      requestBody,
      page: req.query.page,
      isAggregation: false,
    })
      .then(transformApiResponseToSearchCollection(
        { query: req.query },
        transformEventToListItem,
      ))

    const facetBody = pick(requestBody, ['name', 'start_date_after', 'start_date_before', 'organiser'])
    if (keys(facetBody).length > 0) {
      if (facetBody.organiser && facetBody.organiser !== currentAdviserId) {
        delete facetBody.organiser
      }

      res.locals.facets = await facets({
        searchTerm,
        token,
        searchEntity,
        requestBody: facetBody,
      })
    }
    next()
  } catch (error) {
    next(error)
  }
}

function getRequestBody (req, res, next) {
  const selectedFiltersQuery = pick(req.query, [
    'name',
    'event_type',
    'organiser',
    'address_country',
    'uk_region',
    'start_date_after',
    'start_date_before',
  ])

  const selectedSortBy = req.query.sortby ? { sortby: req.query.sortby } : null

  req.body = assign({}, req.body, selectedSortBy, pickBy(selectedFiltersQuery))

  next()
}

module.exports = {
  getEventsCollection,
  getRequestBody,
}
