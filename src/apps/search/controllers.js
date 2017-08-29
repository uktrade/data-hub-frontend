const { get, find } = require('lodash')

const { entities, search } = require('./services')
const { buildSearchAggregation } = require('./builders')
const { buildPagination } = require('../../lib/pagination')
const { transformResultsToCollection } = require('./transformers')

// Deprecated: companies only
function searchAction (req, res, next) {
  const searchTerm = req.query.term
  const entity = find(entities, { path: 'companies' })

  if (!entity) {
    return res
      .breadcrumb('Search')
      .render('search/views/index')
  }

  const searchEntity = entity.entity

  search({
    searchEntity,
    searchTerm,
    token: req.session.token,
    page: req.query.page,
  })
    .then((results) => {
      results.pagination = buildPagination(req.query, results)
      results.aggregations = buildSearchAggregation(results.aggregations)

      res
        .breadcrumb('Search')
        .render(`search/views/results-${searchEntity}`, {
          searchTerm,
          searchEntity,
          searchPath: entity.path,
          results,
        })
    })
    .catch(next)
}

async function renderSearchResults (req, res) {
  const entity = find(entities, ['path', req.params.searchPath])

  if (!entity) {
    return res.render('search/views/index')
  }

  const searchTerm = get(req, 'query.term', '').trim()
  const searchEntity = entity.entity

  const results = await search({
    searchTerm,
    searchEntity,
    requestBody: req.body,
    token: req.session.token,
    page: req.query.page,
  })
    .then(data => transformResultsToCollection(data, searchEntity, {
      searchTerm,
      query: req.query,
    }))

  res
    .breadcrumb(entity.text)
    .render('search/views/results', {
      searchEntity,
      searchTerm,
      results,
    })
}

module.exports = {
  searchAction,
  renderSearchResults,
}
