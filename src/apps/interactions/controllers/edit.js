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
    contact: get(res.locals, 'contact.id'),
  }
  const mergedInteractionData = pickBy(merge({}, interactionDefaults, interactionData, res.locals.requestBody))
  const interactionForm =
    buildFormWithStateAndErrors(
      interactionEditFormConfig(
        {
          returnLink: res.locals.returnLink,
          advisers: get(res.locals, 'advisers.results'),
          contacts: res.locals.contacts,
          services: res.locals.services,
        }),
      mergedInteractionData,
      get(res.locals, 'form.errors.messages'),
    )

  res
    .breadcrumb(`${interactionData ? 'Edit' : 'Add'} interaction`)
    .title(`${interactionData ? 'Edit' : 'Add'} interaction for ${res.locals.entityName}`)
    .render('interactions/views/edit', {
      interactionForm,
    })
}

module.exports = {
  renderEditPage,
}
