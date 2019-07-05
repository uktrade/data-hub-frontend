/* eslint camelcase: 0 */
const { get, lowerCase, snakeCase } = require('lodash')

const { transformInteractionResponseToForm } = require('../transformers')
const { transformDateStringToDateObject } = require('../../transformers')
const { interactionForm, serviceDeliveryForm } = require('../macros')
const { buildFormWithStateAndErrors } = require('../../builders')
const { getInteractionOptions } = require('../services/interaction-options')
const { getReturnLink } = require('../helpers')
const { joinPaths } = require('../../../lib/path')

const formConfigs = {
  'interaction': interactionForm,
  'service-delivery': serviceDeliveryForm,
}

async function getHiddenFields (req, res, interactionId) {
  const hiddenFields = {
    id: interactionId,
    company: get(res.locals, 'company.id'),
    investment_project: get(res.locals, 'investment.id'),
    kind: snakeCase(req.params.kind),
    theme: snakeCase(req.params.theme) || 'other',
  }

  return hiddenFields
}

async function buildForm (req, res, interactionId, validatedKind) {
  const options = await getInteractionOptions(req, res)
  const hiddenFields = await getHiddenFields(req, res, interactionId, validatedKind)
  const returnLink = joinPaths([ getReturnLink(res.locals.interactions), interactionId ])

  const formProperties = {
    ...options,
    hiddenFields,
    returnLink,
    returnText: interactionId ? 'Return without saving' : 'Cancel',
    buttonText: interactionId ? 'Save and return' : `Add ${lowerCase(validatedKind)}`,
    company: get(res.locals, 'company.name'),
  }

  const form = formConfigs[validatedKind](formProperties)
  return form
}

function getMergedData (req, res) {
  const user = get(req.session, 'user')

  function setDefaultContact () {
    if (res.locals.interaction) {
      return res.locals.interaction.contacts.map(contact => contact.id)
    }
    if (res.locals.contact) {
      return [get(res.locals.contact, 'id')]
    }
    return null
  }

  function setDefaultAdvisers (reqBody = {}) {
    if (!get(reqBody, 'dit_participants')) return
    return {
      dit_participants: reqBody.dit_participants.map(ditParticipant => ditParticipant.adviser),
    }
  }

  const interactionData = transformInteractionResponseToForm(res.locals.interaction)
  const interactionDefaults = {
    dit_participants: [user.id],
    date: transformDateStringToDateObject(new Date()),
    contacts: setDefaultContact(),
  }

  const mergedInteractionData = {
    ...interactionDefaults,
    ...interactionData,
    ...res.locals.requestBody,
    ...setDefaultAdvisers(res.locals.requestBody),
  }

  return mergedInteractionData
}

// to avoid an unvalidated dynamic method call
// and for exisiting interactions to use the kind stored in the database to avoid using the wrong form and sending bad data to the backend
function validateKind (paramsKind, activityKindInDatabase) {
  let activityKind = ''
  if (activityKindInDatabase) {
    if (activityKindInDatabase === 'service_delivery') {
      activityKindInDatabase = 'service-delivery'
    }
    activityKind = activityKindInDatabase
  } else if (formConfigs.hasOwnProperty(paramsKind)) {
    activityKind = paramsKind
  } else {
    activityKind = undefined
  }

  return activityKind
}

async function renderEditPage (req, res, next) {
  try {
    const interactionId = get(req.params, 'interactionId')
    const mergedInteractionData = getMergedData(req, res)
    const validatedKind = validateKind(req.params.kind, mergedInteractionData.kind)
    if (validatedKind === undefined) {
      res.redirect('/404')
    }

    const form = await buildForm(req, res, interactionId, validatedKind)
    const errors = get(res.locals, 'form.errors.messages')

    const interactionForm = buildFormWithStateAndErrors(form, mergedInteractionData, errors)

    const forEntityName = res.locals.entityName ? ` for ${res.locals.entityName}` : ''
    const kindName = lowerCase(validatedKind)
    const title = interactionId ? `Edit ${kindName}` : `Add ${kindName + forEntityName}`

    res
      .breadcrumb(`${interactionId ? 'Edit' : 'Add'} ${kindName}`)
      .title(title)
      .render('interactions/views/edit', {
        interactionForm,
      })
  } catch (error) {
    next(error)
  }
}

module.exports = {
  renderEditPage,
}
