const { get, find } = require('lodash')

const { entities, search } = require('./services')
const { transformApiResponseToSearchCollection } = require('./transformers')
const { transformCompanyResponseToListItem } = require('../companies/transformers')
const { transformContactToListItem } = require('../contacts/transformers')
const { transformEventToListItem } = require('../events/transformers')
const { transformInvestmentProjectToListItem } = require('../investment-projects/transformers')
const { transformOrderToListItem } = require('../omis/transformers')
const { transformInteractionToListItem } = require('../interactions/transformers')

async function renderSearchResults (req, res) {
  const entity = find(entities, ['path', req.params.searchPath])

  if (!entity) {
    return res.render('search/view')
  }

  const actionButton = { text: null, url: null }
  const searchTerm = get(req, 'query.term', '').trim()
  const searchEntity = entity.entity
  const itemTransformers = []

  if (searchEntity === 'investment_project') {
    itemTransformers.push(transformInvestmentProjectToListItem)
  }
  if (searchEntity === 'contact') {
    itemTransformers.push(transformContactToListItem)
  }
  if (searchEntity === 'event') {
    itemTransformers.push(transformEventToListItem)
  }
  if (searchEntity === 'order') {
    itemTransformers.push(transformOrderToListItem)
  }

  if (searchEntity === 'company') {
    itemTransformers.push(transformCompanyResponseToListItem)
    actionButton.text = 'Add company'
    actionButton.url = '/companies/add-step-1'
  }

  if (searchEntity === 'interaction') {
    itemTransformers.push(transformInteractionToListItem)
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
        searchTerm,
        query: req.query,
      },
      ...itemTransformers,
    ))

  res
    .breadcrumb(entity.text)
    .render('search/view', {
      actionButton,
      searchEntity,
      searchTerm,
      results,
    })
}

module.exports = {
  renderSearchResults,
}
