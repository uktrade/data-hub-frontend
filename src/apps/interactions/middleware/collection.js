const { assign, merge, pick, pickBy, omit } = require('lodash')

const { ENTITIES } = require('../../search/constants')

const { getCollection } = require('../../../modules/search/middleware/collection')

const { collectionSortForm } = require('../macros')
const { transformInteractionToListItem, transformInteractionListItemToHaveUrlPrefix } = require('../transformers')

async function getInteractionCollection (req, res, next) {
  getCollection('interaction',
    ENTITIES,
    transformInteractionToListItem,
    transformInteractionListItemToHaveUrlPrefix(res.locals.returnLink)
  )(req, res, next)
}

function getInteractionsRequestBody (req, res, next) {
  const searchBody = pick(req.query, [
    'kind',
    'sector_descends',
    'communication_channel',
    'dit_adviser',
    'date_after',
    'date_before',
    'sortby',
    'dit_team',
    'service',
  ])

  if (req.params.contactId) {
    searchBody.contact = req.params.contactId
  }

  if (req.params.companyId) {
    searchBody.company = req.params.companyId
  }

  req.body = assign({}, req.body, pickBy(searchBody))

  next()
}

function getInteractionSortForm (req, res, next) {
  res.locals.sortForm = merge({}, collectionSortForm, {
    hiddenFields: assign({}, omit(req.query, 'sortby')),
    children: [
      { value: req.query.sortby },
    ],
  })

  next()
}

module.exports = {
  getInteractionCollection,
  getInteractionsRequestBody,
  getInteractionSortForm,
}
