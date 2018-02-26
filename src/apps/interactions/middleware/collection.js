const { assign, pick, merge, omit, keys } = require('lodash')

const { collectionSortForm } = require('../macros')
const { search, facets } = require('../../search/services')
const { transformApiResponseToSearchCollection } = require('../../search/transformers')
const { transformInteractionToListItem, transformInteractionListItemToHaveUrlPrefix } = require('../transformers')

async function getInteractionCollection (req, res, next) {
  try {
    const token = req.session.token
    const searchEntity = 'interaction'
    const requestBody = req.body
    const currentAdviserId = req.session.user.id

    res.locals.results = await search({
      token,
      searchEntity,
      requestBody,
      page: req.query.page,
      isAggregation: false,
    })
      .then(transformApiResponseToSearchCollection(
        { query: req.query },
        transformInteractionToListItem,
        transformInteractionListItemToHaveUrlPrefix(res.locals.returnLink),
      ))

    const facetBody = pick(requestBody, ['date_after', 'date_before', 'dit_adviser'])
    if (keys(facetBody).length > 0) {
      if (facetBody.dit_adviser && facetBody.dit_adviser !== currentAdviserId) {
        delete facetBody.dit_adviser
      }

      res.locals.facets = await facets({
        token,
        searchEntity,
        requestBody: facetBody,
      })
    }

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

  req.body = assign({}, req.body, searchBody)

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
