const { assign, merge, omit } = require('lodash')

const { collectionSortForm } = require('../macros')
const { search } = require('../../search/services')
const { transformApiResponseToSearchCollection } = require('../../../modules/search/transformers')
const { transformPropositionToListItem, transformPropositionListItemToHaveUrlPrefix } = require('../transformers')
const { ENTITIES } = require('../../search/constants')

async function getPropositionCollection (req, res, next) {
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
        ENTITIES,
        transformPropositionToListItem,
        transformPropositionListItemToHaveUrlPrefix(res.locals.returnLink),
      ))

    next()
  } catch (error) {
    next(error)
  }
}

function getPropositionSortForm (req, res, next) {
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
  getPropositionSortForm,
}
