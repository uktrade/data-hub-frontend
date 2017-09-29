const { pick, pickBy, assign } = require('lodash')

const { search } = require('../../search/services')
const { transformApiResponseToSearchCollection } = require('../../search/transformers')
const { transformEventToListItem } = require('../transformers')

async function getEventsCollection (req, res, next) {
  try {
    res.locals.results = await search({
      searchEntity: 'event',
      requestBody: req.body,
      token: req.session.token,
      page: req.query.page,
      isAggregation: false,
    })
      .then(transformApiResponseToSearchCollection(
        { query: req.query },
        transformEventToListItem,
      ))

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
    'start_date',
    'end_date',
  ])

  const selectedSortBy = req.query.sortby ? { sortby: req.query.sortby } : null

  req.body = assign({}, req.body, selectedSortBy, pickBy(selectedFiltersQuery))

  next()
}

module.exports = {
  getEventsCollection,
  getRequestBody,
}
