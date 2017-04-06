const authorisedRequest = require('../lib/authorisedrequest')
const config = require('../config')

function mapContacts (contacts) {
  if (contacts && (typeof contacts.map) === 'function') {
    return contacts.map((contact) => {
      return {
        url: `/contact/${contact.id}/details`,
        name: `${contact.first_name} ${contact.last_name}`,
        id: contact.id,
        company: {
          url: `/company/company_company/${contact.company.id}/details`,
          name: contact.company.name,
          id: contact.company.id
        }
      }
    })
  }

  return contacts
}

function mapInteractions (interactions) {
  if (interactions && (typeof interactions.map) === 'function') {
    return interactions.map((interaction) => {
      const company = typeof interaction.company === 'object' ? interaction.company : {}
      return {
        url: `/interaction/${interaction.id}/details`,
        id: interaction.id,
        subject: interaction.subject,
        company: {
          name: company.name,
          url: `/company/company_company/${company.id}/details`
        }
      }
    })
  }

  return interactions
}

module.exports = {
  getHomepageData: (token, days = 15) => {
    return authorisedRequest(token, `${config.apiRoot}/dashboard/homepage/?days=${days}`).then((data) => {
      data.contacts = mapContacts(data.contacts)
      data.interactions = mapInteractions(data.interactions)
      return data
    })
  }
}
