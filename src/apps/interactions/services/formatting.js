const format = require('date-fns/format')
const { formatLongDate, formatMediumDate } = require('../../../../common/date')
const { newlineToBr, getContactLink } = require('../../../lib/text-formatting')
const { getPropertyName } = require('../../../lib/property-helpers')
const { buildCompanyUrl } = require('../../companies/services/data')
const { mapValues, get, isPlainObject } = require('lodash')

/**
 * Returns an interaction formatted for display in the interaction detail
 * page. Compatible with key value table macro
 *
 * @param {any} interaction
 * @returns {Object} A formatted service delivery or interaction
 */
function getDisplayInteraction (interaction) {
  const companyUrl = buildCompanyUrl(interaction.company)
  const result = {
    company: `<a href="${companyUrl}">${interaction.company.name}</a>`,
    interaction_type: interaction.interaction_type.name,
    subject: interaction.subject,
    notes: newlineToBr(interaction.notes),
    date: formatLongDate(interaction.date),
    dit_adviser: getPropertyName(interaction, 'dit_adviser'),
    service: getPropertyName(interaction, 'service'),
    dit_team: getPropertyName(interaction, 'dit_team'),
    contact: getContactLink(interaction),
  }

  return result
}

/**
 * Returns a service delivery or interaction formatted for display in the interaction
 * tab of the company screen
 *
 * @param {any} interaction
 * @returns {Object} A formatted service delivery or interaction
 */
function getDisplayCompanyInteraction (interaction) {
  const interactionType = get(interaction, 'interaction_type.name')
  const entityType = (interactionType === 'Service delivery') ? 'service-deliveries' : 'interactions'

  const result = {
    id: interaction.id,
    url: `/${entityType}/${interaction.id}`,
    interaction_type: interactionType,
    subject: interaction.subject,
    date: formatMediumDate(interaction.date),
    adviser: getPropertyName(interaction, 'dit_adviser'),
    contact: getContactLink(interaction),
    notes: newlineToBr(interaction.notes),
    service: getPropertyName(interaction, 'service'),
    dit_team: getPropertyName(interaction, 'dit_team'),
  }
  return result
}

/**
 * Returns a service delivery or interaction formatted for display in the interaction
 * tab of the contact screen
 *
 * @param {any} interaction
 * @returns {Object} A formatted service delivery or interaction
 */
function getDisplayContactInteraction (interaction) {
  const type = (interaction.interaction_type.name === 'Service delivery') ? 'service-deliveries' : 'interactions'

  const result = {
    id: interaction.id,
    url: `/${type}/${interaction.id}`,
    interaction_type: interaction.interaction_type.name,
    subject: interaction.subject,
    date: formatMediumDate(interaction.date),
    adviser: getPropertyName(interaction, 'dit_adviser'),
    notes: newlineToBr(interaction.notes),
    service: getPropertyName(interaction, 'service'),
    dit_team: getPropertyName(interaction, 'dit_team'),
  }

  return result
}

function transformFromApi (body) {
  if (!isPlainObject(body)) { return }

  const schema = {
    'interaction_type': Object,
    'subject': String,
    'notes': String,
    'date': String,
    'contact': Object,
    'dit_adviser': Object,
  }

  const formatted = mapValues(schema, (type, key) => {
    if (type === Array) {
      return get(body, `${key}[0].id`, '')
    } else if (type === Object) {
      return get(body, `${key}.id`)
    } else {
      return get(body, key)
    }
  })

  const date = new Date(body['date'])
  if (date) {
    formatted['date_year'] = date.getFullYear().toString()
    formatted['date_month'] = format(date, 'MM')
    formatted['date_day'] = format(date, 'DD')
  }

  return Object.assign({}, body, formatted)
}

function transformToApi (body) {
  if (!isPlainObject(body)) { return }

  const schema = {
    'investment_project': Object,
    'interaction_type': Object,
    'dit_adviser': Object,
    'contact': Object,
    'subject': Object,
    'notes': Object,
  }

  const formatted = mapValues(schema, (type, key) => {
    const value = body[key]

    if (!value) {
      return
    }

    return value
  })

  // TODO please see JIRA-469 this needs to be converted to a Date not DateTime in the BE. When done the DateTime creation can be removed
  formatted['date'] = new Date(
    body.date_year,
    body.date_month - 1,
    body.date_day,
  ).toISOString()

  return Object.assign({}, body, formatted)
}

module.exports = {
  getDisplayInteraction,
  getDisplayCompanyInteraction,
  getDisplayContactInteraction,
  transformFromApi,
  transformToApi,
}
