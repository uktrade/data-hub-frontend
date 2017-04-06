const {formatLongDate} = require('../lib/date')
const {newlineToBr} = require('../lib/textformatting')

function getDisplayServiceDelivery (serviceDelivery) {
  const result = {
    company: `<a href="/company/company_company/${serviceDelivery.company.id}">${serviceDelivery.company.name}</a>`,
    dit_team: (serviceDelivery.dit_team && serviceDelivery.dit_team.name) ? serviceDelivery.dit_team.name : null,
    service: (serviceDelivery.service && serviceDelivery.service.name) ? serviceDelivery.service.name : null,
    status: (serviceDelivery.status && serviceDelivery.status.name) ? serviceDelivery.status.name : null,
    subject: serviceDelivery.subject,
    notes: newlineToBr(serviceDelivery.notes),
    date: formatLongDate(serviceDelivery.date),
    contact: `<a href="/contact/${serviceDelivery.contact.id}">${serviceDelivery.contact.first_name} ${serviceDelivery.contact.last_name}</a>`,
    dit_advisor: (serviceDelivery.dit_advisor && serviceDelivery.dit_advisor.name) ? serviceDelivery.dit_advisor.name : null,
    uk_region: (serviceDelivery.uk_region && serviceDelivery.uk_region.name) ? serviceDelivery.uk_region.name : null,
    sector: (serviceDelivery.sector && serviceDelivery.sector.name) ? serviceDelivery.sector.name : null,
    country_of_interest: (serviceDelivery.country_of_interest && serviceDelivery.country_of_interest.name) ? serviceDelivery.country_of_interest.name : null
  }

  if (serviceDelivery.contact) {
    const name = getName(serviceDelivery.contact)
    result.contact = `<a href="/contact/${serviceDelivery.contact.id}/details">${name}</a>`
  }
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

module.exports = {getDisplayServiceDelivery}
