const { sortBy, pick, omit } = require('lodash')
const queryString = require('query-string')

const interactionLabels = require('../labels')
const metadataRepository = require('../../../lib/metadata')
const { getDisplayInteraction } = require('../services/formatting')
const { transformObjectToOption } = require('../../transformers')

const interactonDisplayOrder = [
  'company',
  'interaction_type',
  'subject',
  'notes',
  'contact',
  'date',
  'dit_adviser',
  'service',
  'dit_team',
]

function renderCreatePage (req, res) {
  const interactionTypes = [...metadataRepository.interactionTypeOptions, { id: 999, name: 'Service delivery' }]
  const interactionTypeOptions = interactionTypes.map(transformObjectToOption)

  res
    .breadcrumb('Add interaction')
    .render('interactions/views/add-step-1.njk', {
      contactId: req.query.contact,
      companyId: req.query.company,
      interactionTypeOptions: sortBy(interactionTypeOptions, 'label'),
    })
}

function postAddStep1 (req, res, next) {
  if (!req.body.interaction_type) {
    res.locals.errors = {
      messages: {
        interaction_type: ['You must select an interaction type'],
      },
    }
    return next()
  }

  const interactionData = pick(req.body, 'contact', 'company', 'interaction_type')
  const interactionQueryString = queryString.stringify(interactionData)
  const serviceDeliveryQueryString = queryString.stringify(omit(interactionData, 'interaction_type'))

  if (req.body.interaction_type === '999') {
    return res.redirect(`/service-deliveries/create/?${serviceDeliveryQueryString}`)
  }

  return res.redirect(`/interactions/create/2?${interactionQueryString}`)
}

function renderDetailsPage (req, res, next) {
  res
    .breadcrumb(`Interaction with ${res.locals.interaction.company.name}`)
    .render('interactions/views/details', {
      interactionDetails: getDisplayInteraction(res.locals.interaction),
      interactionLabels: interactionLabels,
      interactionDisplayOrder: interactonDisplayOrder,
    })
}

module.exports = {
  renderCreatePage,
  postAddStep1,
  renderDetailsPage,
}
