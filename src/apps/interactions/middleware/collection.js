const { omit, merge, assign } = require('lodash')
const { search } = require('../../search/services')
const { transformApiResponseToSearchCollection } = require('../../search/transformers')
const { transformInteractionToListItem } = require('../transformers')
const { interactionSortForm } = require('../macros')

async function getInteractionCollection (req, res, next) {
  try {
    const selectedSortBy = req.query.sortby ? { sortby: req.query.sortby } : null
    const contact = req.params.contactId ? { contact: req.params.contactId } : null
    const company = req.params.companyId ? { company: req.params.companyId } : null
    const requestBody = assign({}, req.body, selectedSortBy, contact, company)

    const sortForm = merge({}, interactionSortForm, {
      hiddenFields: assign({}, omit(req.query, 'sortby')),
      children: [
        { value: req.query.sortby },
      ],
    })

    const interactions = await search({
      searchEntity: 'interaction',
      requestBody,
      token: req.session.token,
      page: req.query.page,
      isAggregation: false,
    })
      .then(transformApiResponseToSearchCollection(
        { query: req.query },
        transformInteractionToListItem,
      ))

    res.locals = assign({}, res.locals, {
      sortForm,
      interactions,
    })

    next()
  } catch (error) {
    next(error)
  }
}

module.exports = {
  getInteractionCollection,
}
