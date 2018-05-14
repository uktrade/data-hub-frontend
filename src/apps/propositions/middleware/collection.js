const { assign, merge, pick, pickBy, omit } = require('lodash')

const { collectionSortForm } = require('../macros')
const { search } = require('../../search/services')
const { transformApiResponseToSearchCollection } = require('../../search/transformers')
const { transformPropositionToListItem, transformPropositionListItemToHaveUrlPrefix } = require('../transformers')

async function getPropositionCollection (req, res, next) {
  console.log('!!!!! transformApiResponseToCollection !!!!!!')

  try {
    res.locals.results = await search({
      searchEntity: 'proposition',
      requestBody: req.body,
      token: req.session.token,
      page: req.query.page,
      isAggregation: false,
    })
      .then(transformApiResponseToSearchCollection(
        { query: req.query },
        transformPropositionToListItem,
        transformPropositionListItemToHaveUrlPrefix(res.locals.returnLink),
      ))

    next()
  } catch (error) {
    next(error)
  }
}

function getPropositionsRequestBody (req, res, next) {

  console.log('>>>>>>>>>>>>>> transformApiResponseToCollection <<<<<<<<<<<<<<<<<')
  const searchBody = pick(req.query, [
    'kind',
    'sector_descends',
    'communication_channel',
    'adviser',
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

function getPropositionSortForm (req, res, next) {

  console.log('!!!!! getPropositionSortForm !!!!!!')

  res.locals.sortForm = merge({}, collectionSortForm, {
    hiddenFields: assign({}, omit(req.query, 'sortby')),
    children: [
      { value: req.query.sortby },
    ],
  })

  next()
}

module.exports = {
  getPropositionCollection,
  getPropositionsRequestBody,
  getPropositionSortForm,
}
