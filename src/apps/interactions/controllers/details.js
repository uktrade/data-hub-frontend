const {
  sortBy,
  pick,
  omit,
  lowerCase,
  capitalize,
} = require('lodash')
const queryString = require('query-string')

const metadataRepository = require('../../../lib/metadata')

const { transformObjectToOption } = require('../../transformers')
const { transformInteractionResponsetoViewRecord } = require('../transformers')

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
  try {
    const { interaction } = res.locals
    const breadcrumb = capitalize(lowerCase(interaction.kind))
    const interactionViewRecord = transformInteractionResponsetoViewRecord(interaction)

    return res
      .breadcrumb(breadcrumb)
      .render('interactions/views/details', {
        interactionViewRecord,
      })
  } catch (error) {
    next(error)
  }
}

module.exports = {
  renderCreatePage,
  postAddStep1,
  renderDetailsPage,
}
