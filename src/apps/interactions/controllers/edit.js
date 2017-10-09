/* eslint camelcase: 0 */
const { get, merge, pickBy } = require('lodash')

const { transformInteractionResponseToForm } = require('../transformers')
const { transformDateStringToDateObject } = require('../../transformers')
const { interactionEditFormConfig } = require('../macros')
const { buildFormWithStateAndErrors } = require('../../builders')

function renderEditPage (req, res) {
  const interactionData = transformInteractionResponseToForm(res.locals.interaction)
  const interactionDefaults = {
    dit_adviser: req.session.user,
    date: transformDateStringToDateObject(new Date()),
  }

  if (res.locals.contact) {
    interactionDefaults.contact = res.locals.contact
  }

  const mergedInteractionData = pickBy(merge({}, interactionDefaults, interactionData, res.locals.requestBody))

  const {
    advisers,
    contacts,
    communicationChannelOptions,
    services,
  } = res.locals

  const interactionForm =
    buildFormWithStateAndErrors(
      interactionEditFormConfig({
        returnLink: '',
        advisers,
        contacts,
        communicationChannelOptions,
        services,
        id: get(res.locals.interaction, 'id', null),
      }),
      mergedInteractionData,
      get(res.locals, 'form.errors.messages'),
    )

  res
    .breadcrumb(`${interactionData ? 'Edit' : 'Add'} interaction`)
    .title(`${interactionData ? 'Edit' : 'Add'} interaction for ${res.locals.company.name}`)
    .render('interactions/views/edit', {
      interactionForm,
    })
}

module.exports = {
  renderEditPage,
}
