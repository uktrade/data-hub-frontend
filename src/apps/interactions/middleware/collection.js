const { assign, merge, pick, pickBy, omit } = require('lodash')

const { ENTITIES } = require('../../search/constants')
const { QUERY_DATE_FIELDS } = require('../constants')

const { transformApiResponseToCollection } = require('../../../modules/api/transformers')
const { getCollection } = require('../../../modules/search/middleware/collection')
const reverseDateIfIE = require('../../../lib/if-ie-reverse-date-value')

const { interactionSortForm, defaultInteractionSort } = require('../macros/collection-sort-form')
const { getInteractionsForEntity } = require('../repos')
const { transformInteractionToListItem, transformInteractionListItemToHaveUrlPrefix } = require('../transformers')

async function getInteractionCollection (req, res, next) {
  getCollection('interaction',
    ENTITIES,
    transformInteractionToListItem
  )(req, res, next)
}

async function getInteractionCollectionForEntity (req, res, next) {
  try {
    const { query: entityQuery } = res.locals.interactions
    const params = {
      entityQuery,
      token: req.session.token,
      page: req.query.page,
      sortby: req.query.sortby || defaultInteractionSort,
    }

    res.locals.results = await getInteractionsForEntity(params)
      .then(transformApiResponseToCollection(
        { query: req.query },
        transformInteractionToListItem,
        transformInteractionListItemToHaveUrlPrefix(res.locals.interactions.returnLink)
      ))

    next()
  } catch (error) {
    next(error)
  }
}

function getInteractionsRequestBody (req, res, next) {
  if (res.locals.userAgent) {
    QUERY_DATE_FIELDS.forEach((date) => {
      req.query[date] = reverseDateIfIE(req.query[date], res.locals.userAgent)
    })
  }

  const searchBody = pick(req.query, [
    'kind',
    'sector_descends',
    'communication_channel',
    'dit_participants__adviser',
    ...QUERY_DATE_FIELDS,
    'sortby',
    'dit_participants__team',
    'service',
    'was_policy_feedback_provided',
    'policy_areas',
    'policy_issue_types',
  ])

  req.body = {
    ...req.body,
    ...pickBy(searchBody),
  }

  next()
}

function getInteractionSortForm (req, res, next) {
  res.locals.sortForm = merge({}, interactionSortForm, {
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
