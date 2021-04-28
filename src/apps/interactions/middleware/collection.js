const { assign, get, merge, pick, pickBy, omit } = require('lodash')

const { ENTITIES } = require('../../search/constants')
const { QUERY_DATE_FIELDS } = require('../constants')

const {
  transformApiResponseToCollection,
} = require('../../../modules/api/transformers')
const {
  getCollection,
} = require('../../../modules/search/middleware/collection')
const reverseDateIfIE = require('../../../lib/if-ie-reverse-date-value')

const {
  buildInteractionSortForm,
  getDefaultInteractionSort,
} = require('../macros/collection-sort-form')
const { getInteractionsForEntity } = require('../repos')
const {
  transformInteractionToListItem,
  transformInteractionListItemToHaveUrlPrefix,
} = require('../transformers')

async function getInteractionCollection(req, res, next) {
  getCollection('interaction', ENTITIES, transformInteractionToListItem())(
    req,
    res,
    next
  )
}

async function getInteractionCollectionForEntity(req, res, next) {
  try {
    const { query: entityQuery, showCompany } = res.locals.interactions
    const params = {
      entityQuery,
      req,
      page: req.query.page,
      sortby: req.query.sortby || getDefaultInteractionSort(showCompany),
    }

    res.locals.results = await getInteractionsForEntity(params).then(
      transformApiResponseToCollection(
        { query: req.query },
        transformInteractionToListItem(showCompany),
        transformInteractionListItemToHaveUrlPrefix(
          res.locals.interactions.returnLink
        )
      )
    )

    next()
  } catch (error) {
    next(error)
  }
}

function getInteractionsRequestBody(req, res, next) {
  if (res.locals.userAgent) {
    QUERY_DATE_FIELDS.forEach((date) => {
      req.query[date] = reverseDateIfIE(req.query[date], res.locals.userAgent)
    })
  }

  const searchBody = pick(req.query, [
    'kind',
    'sector_descends',
    'communication_channel',
    'company_one_list_group_tier',
    'dit_participants__adviser',
    ...QUERY_DATE_FIELDS,
    'sortby',
    'dit_participants__team',
    'service',
    'was_policy_feedback_provided',
    'policy_areas',
    'policy_issue_types',
    'has_related_trade_agreements',
    'related_trade_agreements',
  ])

  req.body = {
    ...req.body,
    ...pickBy(searchBody),
  }

  next()
}

function getInteractionSortForm(req, res, next) {
  const showCompany = get(res.locals, 'interactions.showCompany', true)

  res.locals.sortForm = merge({}, buildInteractionSortForm(showCompany), {
    hiddenFields: assign({}, omit(req.query, 'sortby')),
    children: [{ value: req.query.sortby }],
  })

  next()
}

module.exports = {
  getInteractionCollection,
  getInteractionCollectionForEntity,
  getInteractionsRequestBody,
  getInteractionSortForm,
}
