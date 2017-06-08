const { formatLongDate, formatMediumDate } = require('../lib/date')
const { newlineToBr, getContactLink } = require('../lib/text-formatting')
const { getPropertyName } = require('../lib/property-helpers')
const { buildCompanyUrl } = require('./company.service')

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
  const type = (interaction.interaction_type.name === 'Service delivery') ? 'servicedelivery' : 'interaction'

  const result = {
    id: interaction.id,
    url: `/${type}/${interaction.id}/details`,
    interaction_type: interaction.interaction_type.name,
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
  const type = (interaction.interaction_type.name === 'Service delivery') ? 'servicedelivery' : 'interaction'

  const result = {
    id: interaction.id,
    url: `/${type}/${interaction.id}/details`,
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

module.exports = { getDisplayInteraction, getDisplayCompanyInteraction, getDisplayContactInteraction }
