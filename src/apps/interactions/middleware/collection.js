const { assign, merge, pick, pickBy, omit } = require('lodash')

const { collectionSortForm } = require('../macros')
const { search } = require('../../search/services')
const { transformApiResponseToSearchCollection } = require('../../search/transformers')
const { transformInteractionToListItem, transformInteractionListItemToHaveUrlPrefix } = require('../transformers')

async function getInteractionCollection (req, res, next) {
  try {
    res.locals.results = await search({
      searchEntity: 'interaction',
      requestBody: req.body,
      token: req.session.token,
      page: req.query.page,
      isAggregation: false,
    })
      .then(transformApiResponseToSearchCollection(
        { query: req.query },
        transformInteractionToListItem,
        transformInteractionListItemToHaveUrlPrefix(res.locals.returnLink),
      ))

    next()
  } catch (error) {
    next(error)
  }
}

function getInteractionsRequestBody (req, res, next) {
  const searchBody = pick(req.query, [
    'kind',
    'communication_channel',
    'dit_adviser',
    'date_after',
    'date_before',
    'sortby',
    'dit_team',
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
