/* eslint camelcase: 0 */
const { get, set, lowerCase, snakeCase, kebabCase } = require('lodash')

const { transformInteractionResponseToForm } = require('../transformers')
const { transformDateStringToDateObject } = require('../../transformers')
const { interactionForm, serviceDeliveryForm } = require('../macros')
const { buildFormWithStateAndErrors } = require('../../builders')
const { getInteractionOptions } = require('../services/interaction-options')
const { getReturnLink } = require('../helpers')
const { joinPaths } = require('../../../lib/path')
const isValidTheme = require('../macros/is-valid-theme')
const canAddCountries = require('../macros/can-add-countries')

const { KINDS, THEMES } = require('../constants')
const { EXPORT_INTEREST_STATUS_VALUES } = require('../../constants')

const formConfigs = {
  [KINDS.INTERACTION]: interactionForm,
  [KINDS.SERVICE_DELIVERY]: serviceDeliveryForm,
}

function getHiddenFields(req, res, interactionId) {
  return {
    id: interactionId,
    company: get(res.locals, 'company.id'),
    investment_project: get(res.locals, 'investment.id'),
    kind: snakeCase(req.params.kind),
    theme: snakeCase(req.params.theme) || THEMES.OTHER,
  }
}

async function buildForm(req, res, params) {
  const { interactionId, theme, kind } = params
  const options = await getInteractionOptions(req, res)
  const hiddenFields = getHiddenFields(req, res, interactionId)
  const returnLink = joinPaths([
    getReturnLink(res.locals.interactions),
    interactionId,
  ])

  const formProperties = {
    ...options,
    hiddenFields,
    returnLink,
    returnText: interactionId ? 'Return without saving' : 'Cancel',
    buttonText: interactionId ? 'Save and return' : `Add ${lowerCase(kind)}`,
    company: get(res.locals, 'company.name'),
    theme,
    interaction: res.locals.interaction,
  }

  return formConfigs[kind](formProperties)
}

function setDefaultContact(interaction, contact) {
  if (interaction) {
    return interaction.contacts.map((contact) => contact.id)
  }
  if (contact) {
    return [get(contact, 'id')]
  }
  return null
}

function setDefaultAdvisers(reqBody = {}) {
  if (!get(reqBody, 'dit_participants')) return
  return {
    dit_participants: reqBody.dit_participants.map(
      (ditParticipant) => ditParticipant.adviser
    ),
  }
}

function getMergedData(user, locals) {
  const { interaction, contact, requestBody } = locals
  const interactionData = transformInteractionResponseToForm(interaction)
  const interactionDefaults = {
    dit_participants: [user.id],
    date: transformDateStringToDateObject(new Date()),
    contacts: setDefaultContact(interaction, contact),
  }

  return {
    ...interactionDefaults,
    ...interactionData,
    ...requestBody,
    ...setDefaultAdvisers(requestBody),
  }
}

function getValidatedKind(requestParamsKind, existingKind) {
  if (existingKind) {
    return kebabCase(existingKind)
  }

  if (formConfigs.hasOwnProperty(requestParamsKind)) {
    return requestParamsKind
  }
}

function getOption(options) {
  return function(id) {
    return options.find((option) => option.value === id)
  }
}

function addSelectedOptions(fields) {
  return function(name) {
    const field = fields.find((field) => field.name === name)
    if (field && field.value) {
      field.selectedOptions = []
        .concat(field.value)
        .map(getOption(field.options))
    }
  }
}

async function renderEditPage(req, res, next) {
  try {
    const { interactionId, kind, theme } = req.params
    const mergedInteractionData = getMergedData(req.session.user, res.locals)
    const validatedKind = getValidatedKind(kind, mergedInteractionData.kind)

    if (!isValidTheme(theme)) {
      throw new Error('Invalid theme')
    }

    if (!validatedKind) {
      throw new Error('Invalid kind')
    }

    const form = await buildForm(req, res, {
      interactionId,
      theme,
      kind: validatedKind,
    })
    const errors = get(res.locals, 'form.errors.messages')
    const nonFieldErrors = get(res.locals, 'form.errors.nonField')

    const interactionForm = buildFormWithStateAndErrors(
      form,
      mergedInteractionData,
      errors
    )

    if (nonFieldErrors) {
      set(interactionForm, 'errors.nonField', nonFieldErrors)
    }

    const forEntityName = res.locals.entityName
      ? ` for ${res.locals.entityName}`
      : ''
    const kindName = lowerCase(validatedKind)
    const title = interactionId
      ? `Edit ${kindName}`
      : `Add ${kindName + forEntityName}`

    // istanbul ignore next: Covered by functional tests
    if (canAddCountries(theme, res.locals.interaction)) {
      EXPORT_INTEREST_STATUS_VALUES.forEach(
        addSelectedOptions(interactionForm.children)
      )
    }

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
