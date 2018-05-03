/* eslint camelcase: 0 */
const { get, merge, pickBy, lowerCase, snakeCase, assign } = require('lodash')

const { transformInteractionResponseToForm } = require('../transformers')
const { transformDateStringToDateObject } = require('../../transformers')
const { eventInteractionForm, interactionForm, serviceDeliveryForm, policyFeedbackForm } = require('../macros')
const { buildFormWithStateAndErrors } = require('../../builders')

const formConfigs = {
  'interaction': interactionForm,
  'event-interaction': eventInteractionForm,
  'service-delivery': serviceDeliveryForm,
  'policy-feedback': policyFeedbackForm,
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
  const interactionId = get(res.locals, 'interaction.id')

  const getFormKind = function (kind, is_event = false) {
    let formKind

    if (kind === 'service-delivery' && is_event) {
      formKind = 'event-interaction'
    } else {
      formKind = kind
    }

    return formKind
  }

  const is_event = interactionData ? interactionData.is_event : false
  const formKind = getFormKind(req.params.kind, is_event)

  console.log('=============> ', formKind)

  const interactionForm =
      buildFormWithStateAndErrors(
        formConfigs[formKind](
          assign({}, res.locals.options, res.locals.conditions, {
            returnLink: interactionId ? `/interactions/${interactionId}` : res.locals.returnLink,
            returnText: interactionId ? 'Return without saving' : 'Cancel',
            buttonText: interactionId ? 'Save and return' : `Add ${lowerCase(formKind)}`,
            hiddenFields: {
              id: interactionId,
              company: res.locals.company.id,
              investment_project: get(res.locals, 'investmentData.id'),
              kind: snakeCase(formKind),
            },
          })),
        mergedInteractionData,
        get(res.locals, 'form.errors.messages'),
      )

  const forEntityName = res.locals.entityName ? ` for ${res.locals.entityName}` : ''
  const kindName = lowerCase(formKind)
  const actionName = (interactionData ? 'Edit' : 'Add')

  console.log(interactionForm)
  res
    .breadcrumb(`${actionName} ${kindName}`)
    .title(`${actionName} ${kindName + forEntityName}`)
    .render('interactions/views/edit', {
      interactionForm,
    })
}

module.exports = {
  renderEditPage,
}
