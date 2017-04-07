const {formatLongDate} = require('../lib/date')
const {newlineToBr, getContactLink, getPropertyName} = require('../lib/textformatting')

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

module.exports = {getDisplayInteraction, getDisplayCompanyInteraction}
