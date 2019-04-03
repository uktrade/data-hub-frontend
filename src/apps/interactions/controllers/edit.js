/* eslint camelcase: 0 */
const { get, lowerCase, snakeCase } = require('lodash')

const { transformInteractionResponseToForm } = require('../transformers')
const { transformDateStringToDateObject } = require('../../transformers')
const { interactionForm, serviceDeliveryForm } = require('../macros')
const { buildFormWithStateAndErrors } = require('../../builders')
const { getInteractionOptions } = require('../services/interaction-options')

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
  }

  return hiddenFields
}

const getReturnLink = (res, interactionId) => {
  const urlPrefix = (res.locals.interactions && res.locals.interactions.returnLink) || '/interactions/'
  return interactionId ? `${urlPrefix}${interactionId}` : urlPrefix
}

async function buildForm (req, res, interactionId) {
  const options = await getInteractionOptions(req, res)
  const hiddenFields = await getHiddenFields(req, res, interactionId)
  const returnLink = getReturnLink(res, interactionId)

  const formProperties = {
    ...options,
    hiddenFields,
    returnLink,
    returnText: interactionId ? 'Return without saving' : 'Cancel',
    buttonText: interactionId ? 'Save and return' : `Add ${lowerCase(req.params.kind)}`,
  }

  const form = formConfigs[req.params.kind](formProperties)
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

async function renderEditPage (req, res, next) {
  try {
    const interactionId = get(req.params, 'interactionId')
    const mergedInteractionData = getMergedData(req, res)
    const form = await buildForm(req, res, interactionId)
    const errors = get(res.locals, 'form.errors.messages')

    const interactionForm = buildFormWithStateAndErrors(form, mergedInteractionData, errors)

    const forEntityName = res.locals.entityName ? ` for ${res.locals.entityName}` : ''
    const kindName = lowerCase(req.params.kind)
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
