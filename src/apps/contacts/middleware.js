const { pick, pickBy } = require('lodash')

const { searchContacts } = require('../search/services')
const { transformContactsResultsToCollection } = require('./transformers')

async function getContactsCollection (req, res, next) {
  try {
    res.locals.results = await searchContacts({
      token: req.session.token,
      requestBody: req.body,
      limit: 10,
      page: parseInt(req.query.page, 10) || 1,
    })
      .then(result => transformContactsResultsToCollection(result, req.query))

    next()
  } catch (error) {
    next(error)
  }
}

function getRequestBody (req, res, next) {
  const selectedFiltersQuery = pick(req.query, [
    'sector',
    'company',
  ])

  const selectedSortBy = req.query.sortby ? { sortby: req.query.sortby } : null

  req.body = Object.assign({}, req.body, selectedSortBy, pickBy(selectedFiltersQuery))

  next()
}

module.exports = {
  getContactsCollection,
  getRequestBody,
}
