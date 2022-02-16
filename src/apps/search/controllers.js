const { get, find } = require('lodash')

const { ENTITIES } = require('./constants')
const { search } = require('../../modules/search/services')
const {
  transformApiResponseToSearchCollection,
} = require('../../modules/search/transformers')
const { transformCompanyToListItem } = require('../companies/transformers')
const { transformContactToListItem } = require('../contacts/transformers')
const { transformEventToListItem } = require('../events/transformers')
const {
  transformInvestmentProjectToListItem,
} = require('../investments/transformers')
const { transformOrderToListItem } = require('../omis/transformers')
const {
  transformInteractionToListItem,
} = require('../interactions/transformers')

async function renderSearchResults(req, res) {
  const entity = find(ENTITIES, ['path', req.params.searchPath])

  if (!entity) {
    return res.render('search/view')
  }

  const actionButtons = []
  const searchTerm = get(req, 'query.term', '').trim()
  const showArchived =
    get(req, 'query.showArchived', '').trim().toLowerCase() === 'true'
  const searchEntity = entity.entity
  const itemTransformers = []

  if (searchEntity === 'investment_project') {
    itemTransformers.push(transformInvestmentProjectToListItem)
  } else if (searchEntity === 'contact') {
    itemTransformers.push(transformContactToListItem)
  } else if (searchEntity === 'event') {
    itemTransformers.push(transformEventToListItem)
    actionButtons.push({
      label: 'Add event',
      url: '/events/create',
    })
  } else if (searchEntity === 'order') {
    itemTransformers.push(transformOrderToListItem)
    actionButtons.push({
      label: 'Add order',
      url: '/omis/create',
    })
  } else if (searchEntity === 'company') {
    itemTransformers.push(transformCompanyToListItem)
    actionButtons.push({
      label: 'Add company',
      url: '/companies/create',
    })
  } else if (searchEntity === 'interaction') {
    itemTransformers.push(transformInteractionToListItem())
  }

  const flipShowArchivedURL = new URL(
    req.protocol + '://' + req.get('host') + req.originalUrl
  )
  if (showArchived) {
    flipShowArchivedURL.searchParams.delete('showArchived')
  } else {
    flipShowArchivedURL.searchParams.append('showArchived', 'true')
  }

  const results = await search({
    searchTerm,
    searchEntity,
    req,
    page: req.query.page,
    showArchived: showArchived,
  }).then(
    transformApiResponseToSearchCollection(
      {
        searchTerm,
        query: req.query,
        userPermissions: get(res, 'locals.user.permissions'),
      },
      ENTITIES,
      ...itemTransformers
    )
  )

  res.breadcrumb(entity.text).render('search/view', {
    actionButtons,
    searchEntity,
    searchTerm,
    results,
    showArchived,
    flipShowArchivedURL: flipShowArchivedURL.toString(),
  })
}

module.exports = {
  renderSearchResults,
}
