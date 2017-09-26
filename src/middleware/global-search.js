const { get, find } = require('lodash')

const { entities, search } = require('../apps/search/services')

const { transformApiResponseToSearchCollection } = require('../apps/search/transformers')
const { transformCompanyToListItem } = require('../apps/companies/transformers')
const { transformContactToListItem } = require('../apps/contacts/transformers')
const { transformEventToListItem } = require('../apps/events/transformers')
const { transformInvestmentProjectToListItem } = require('../apps/investment-projects/transformers')
const { transformOrderToListItem } = require('../apps/omis/transformers')
const { transformInteractionToListItem } = require('../apps/interactions/transformers')

async function searchMiddleware (req, res, next) {
  const entityPathExtract = req.path.replace(/^\/([a-z-]+).*/, '$1')
  const entityPath = entityPathExtract === '/' ? 'companies' : entityPathExtract
  const entity = find(entities, ['path', entityPath])

  console.log(entityPath)

  res.locals = Object.assign({}, res.locals, {
    globalSearchFormConfig: {
      searchTerm: req.query.term,
      action: `/${entityPath}`,
      inputName: 'term',
      inputLabel: 'Search',
      modifier: 'header',
      fieldModifier: 'light',
      hiddenFields: { global: true },
    },
  })

  if (!entity) {
    return next()
  }

  const actionButton = { text: null, url: null }
  const searchTerm = get(req, 'query.term', '').trim()
  const searchEntity = entity.entity
  const itemTransformers = []
  let searchResults

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
    itemTransformers.push(transformCompanyToListItem)
    actionButton.text = 'Add company'
    actionButton.url = '/companies/add-step-1'
  }

  if (searchEntity === 'interaction') {
    itemTransformers.push(transformInteractionToListItem)
  }

  try {
    searchResults = await search({
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
  } catch (error) {
    next(error)
  }

  res.locals = Object.assign({}, res.locals, {
    searchResults,
    searchTerm,
  })

  next()
}

module.exports = searchMiddleware
