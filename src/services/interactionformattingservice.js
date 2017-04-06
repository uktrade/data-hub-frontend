const {formatLongDate} = require('../lib/date')
const {newlineToBr} = require('../lib/textformatting')

function getDisplayInteraction (interaction) {
  const result = {
    company: `<a href="/company/company_company/${interaction.company.id}/details">${interaction.company.name}</a>`,
    interaction_type: interaction.interaction_type.name,
    subject: interaction.subject,
    notes: newlineToBr(interaction.notes),
    date: formatLongDate(interaction.date),
    dit_advisor: (interaction.dit_advisor && interaction.dit_advisor.name) ? interaction.dit_advisor.name : null,
    service: (interaction.service && interaction.service.name) ? interaction.service.name : null,
    dit_team: (interaction.dit_team && interaction.dit_team.name) ? interaction.dit_team.name : null
  }
  if (interaction.contact) {
    const name = getName(interaction.contact)
    result.contact = `<a href="/contact/${interaction.contact.id}/details">${name}</a>`
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
    advisor: (interaction.dit_advisor && interaction.dit_advisor.name) ? interaction.dit_advisor.name : null
  }

  if (interaction.contact) {
    result.contact = getName(interaction.contact)
  }
  return result
}

function getName (contact) {
  let name = ''
  if (contact.first_name) {
    name += `${contact.first_name} `
  }
  if (contact.last_name) {
    name += contact.last_name
  }
  return name.trim()
}

module.exports = {getDisplayInteraction, getDisplayCompanyInteraction}
