const { pick, pickBy } = require('lodash')

const { search } = require('../../../search/services')
const { transformApiResponseToSearchCollection } = require('../../../search/transformers')
const { transformOrderToListItem } = require('../../transformers')

async function setResults (req, res, next) {
  try {
    res.locals.results = await search({
      searchEntity: 'order',
      requestBody: req.body,
      token: req.session.token,
      page: req.query.page,
      isAggregation: false,
    })
      .then(transformApiResponseToSearchCollection(
        { query: req.query },
        transformOrderToListItem,
      ))

    next()
  } catch (error) {
    next(error)
  }
}

function setRequestBody (req, res, next) {
  const selectedSortBy = req.query.sortby ? { sortby: req.query.sortby } : null
  const selectedFiltersQuery = pick(req.query, [
    'status',
    'company_name',
    'contact_name',
    'primary_market',
    'uk_region',
    'reference',
    'total_cost',
    'net_cost',
    'sector_descends',
  ])

  req.body = pickBy({
    ...req.body,
    ...selectedSortBy,
    ...pickBy(selectedFiltersQuery),
  })

  const currencyFields = ['total_cost', 'net_cost']
  currencyFields.forEach((field) => {
    if (req.body[field]) {
      req.body[field] = parseFloat(req.query[field]) * 100
    }
  })

  next()
}

module.exports = {
  setResults,
  setRequestBody,
}
