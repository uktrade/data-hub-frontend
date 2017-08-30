const { get, find } = require('lodash')

const { entities, search } = require('./services')
const { transformApiResponseToSearchCollection } = require('./transformers')
const { transformContactToListItem } = require('../contacts/transformers')
const { transformInvestmentProjectToListItem } = require('../investment-projects/transformers')
const { transformOrderToListItem } = require('../omis/transformers')

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
    .then(transformApiResponseToSearchCollection({
      entityType: searchEntity,
      searchTerm,
      query: req.query,
    }))
    .then((results) => {
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
  const itemTransformers = []

  if (searchEntity === 'investment_project') {
    itemTransformers.push(transformInvestmentProjectToListItem)
  }
  if (searchEntity === 'contact') {
    itemTransformers.push(transformContactToListItem)
  }
  if (searchEntity === 'order') {
    itemTransformers.push(transformOrderToListItem)
  }

  const results = await search({
    searchTerm,
    searchEntity,
    requestBody: req.body,
    token: req.session.token,
    page: req.query.page,
  })
    .then(transformApiResponseToSearchCollection(
      {
        entityType: searchEntity,
        searchTerm,
        query: req.query,
      },
      ...itemTransformers,
    ))

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
