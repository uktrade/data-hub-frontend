/* eslint camelcase: 0 */
const { sortBy, pick, omit } = require('lodash')
const queryString = require('query-string')

const interactionLabels = require('../labels')
const metadataRepository = require('../../../lib/metadata')
const interactionDataService = require('../services/data')
const { getDisplayInteraction } = require('../services/formatting')
const { transformObjectToOption } = require('../../transformers')

const interactonDisplayOrder = ['company', 'interaction_type', 'subject', 'notes', 'contact', 'date', 'dit_adviser', 'service', 'dit_team']

async function getCommon (req, res, next) {
  try {
    const token = req.session.token
    if (req.params.interactionId && req.params.interactionId !== 'add') {
      res.locals.interaction = await interactionDataService.getHydratedInteraction(token, req.params.interactionId)
    }
    next()
  } catch (error) {
    next(error)
  }
}

function getAddStep1 (req, res) {
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

function postAddStep1 (req, res) {
  if (!req.body.interaction_type) {
    res.locals.errors = {
      messages: {
        interaction_type: ['You must select an interaction type'],
      },
    }
    return getAddStep1(req, res)
  }

  const interactionData = pick(req.body, 'contact', 'company', 'interaction_type')
  const interactionQueryString = queryString.stringify(interactionData)
  const serviceDeliveryQueryString = queryString.stringify(omit(interactionData, 'interaction_type'))

  if (req.body.interaction_type === '999') {
    return res.redirect(`/service-deliveries/create/?${serviceDeliveryQueryString}`)
  }

  return res.redirect(`2?${interactionQueryString}`)
}

function getInteractionDetails (req, res, next) {
  res
    .breadcrumb(`Interaction with ${res.locals.interaction.company.name}`)
    .render('interactions/views/details', {
      interactionDetails: getDisplayInteraction(res.locals.interaction),
      interactionLabels: interactionLabels,
      interactionDisplayOrder: interactonDisplayOrder,
    })
}

module.exports = {
  getAddStep1,
  postAddStep1,
  getCommon,
  getInteractionDetails,
}
