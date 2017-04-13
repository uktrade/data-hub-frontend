const {formatLongDate} = require('../lib/date')
const {newlineToBr, getContactLink} = require('../lib/textformatting')
const {getPropertyName} = require('../lib/propertyhelpers')

/**
 * Returns an interaction formatted for display in the interaction detail
 * page. Compatible with key value table macro
 *
 * @param {any} interaction
 * @returns {Object} A formatted service delivery or interaction
 */
function getDisplayInteraction (interaction) {
  const result = {
    company: `<a href="/company/company_company/${interaction.company.id}/details">${interaction.company.name}</a>`,
    interaction_type: interaction.interaction_type.name,
    subject: interaction.subject,
    notes: newlineToBr(interaction.notes),
    date: formatLongDate(interaction.date),
    dit_advisor: getPropertyName(interaction, 'dit_advisor'),
    service: getPropertyName(interaction, 'service'),
    dit_team: getPropertyName(interaction, 'dit_team'),
    contact: getContactLink(interaction)
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
    url: `/${type}/${interaction.id}/details`,
    interaction_type: interaction.interaction_type.name,
    subject: interaction.subject,
    date: formatLongDate(interaction.date),
    advisor: getPropertyName(interaction, 'dit_advisor'),
    contact: getContactLink(interaction)
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
    url: `/${type}/${interaction.id}/details`,
    interaction_type: interaction.interaction_type.name,
    subject: interaction.subject,
    date: formatLongDate(interaction.date),
    advisor: getPropertyName(interaction, 'dit_advisor')
  }

  return result
}

module.exports = {getDisplayInteraction, getDisplayCompanyInteraction, getDisplayContactInteraction}
