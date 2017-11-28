/* eslint camelcase: 0 */
const { get, merge, pickBy, lowerCase, snakeCase } = require('lodash')

const { transformInteractionResponseToForm } = require('../transformers')
const { transformDateStringToDateObject } = require('../../transformers')
const { interactionFormConfig, serviceDeliveryFormConfig } = require('../macros')
const { buildFormWithStateAndErrors } = require('../../builders')
const formConfigs = {
  'interaction': interactionFormConfig,
  'service-delivery': serviceDeliveryFormConfig,
}

function renderEditPage (req, res) {
  const interactionData = transformInteractionResponseToForm(res.locals.interaction)
  const interactionDefaults = {
    dit_adviser: req.session.user,
    date: transformDateStringToDateObject(new Date()),
    contact: get(res.locals, 'contact.id'),
    dit_team: get(req, 'session.user.dit_team.id'),
  }
  const mergedInteractionData = pickBy(merge({}, interactionDefaults, interactionData, res.locals.requestBody))
  const interactionForm =
    buildFormWithStateAndErrors(
      formConfigs[req.params.kind](
        {
          returnLink: res.locals.returnLink,
          advisers: res.locals.advisers,
          contacts: res.locals.contacts,
          services: res.locals.services,
          events: res.locals.events,
          hiddenFields: {
            id: get(res.locals, 'interaction.id'),
            company: res.locals.company.id,
            investment_project: get(res.locals, 'investmentData.id'),
            kind: snakeCase(req.params.kind),
          },
        }),
      mergedInteractionData,
      get(res.locals, 'form.errors.messages'),
    )

  const forEntityName = res.locals.entityName ? ` for ${res.locals.entityName}` : ''

  res
    .breadcrumb(`${interactionData ? 'Edit' : 'Add'} ${lowerCase(req.params.kind)}`)
    .title(`${interactionData ? 'Edit' : 'Add'} ${lowerCase(req.params.kind) + forEntityName}`)
    .render('interactions/views/edit', {
      interactionForm,
    })
}

module.exports = {
  renderEditPage,
}
