const { assign, merge, pick, pickBy, omit } = require('lodash')

const { ENTITIES } = require('../../search/constants')

const { transformApiResponseToCollection } = require('../../../modules/api/transformers')
const { getCollection } = require('../../../modules/search/middleware/collection')

const { collectionSortForm } = require('../macros')
const { getInteractionsForEntity } = require('../repos')
const { transformInteractionToListItem, transformInteractionListItemToHaveUrlPrefix } = require('../transformers')

async function getInteractionCollection (req, res, next) {
  getCollection('interaction',
    ENTITIES,
    transformInteractionToListItem,
    transformInteractionListItemToHaveUrlPrefix(res.locals.returnLink)
  )(req, res, next)
}

async function getInteractionCollectionForEntity (req, res, next) {
  try {
    const token = req.session.token
    const page = req.query.page || '1'
    const { query } = res.locals.interactions

    res.locals.results = await getInteractionsForEntity(token, query, page)
      .then(transformApiResponseToCollection(
        { entityType: 'interaction' },
        transformInteractionToListItem,
        transformInteractionListItemToHaveUrlPrefix(res.locals.returnLink)
      ))

    next()
  } catch (error) {
    next(error)
  }
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

  req.body = {
    ...req.body,
    ...pickBy(searchBody),
  }

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
  getInteractionCollectionForEntity,
  getInteractionsRequestBody,
  getInteractionSortForm,
}
