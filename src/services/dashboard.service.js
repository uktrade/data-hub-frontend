const authorisedRequest = require('../lib/authorised-request')
const config = require('../../config')
const { buildCompanyUrl } = require('./company.service')

function mapContacts (contacts) {
  if (contacts && (typeof contacts.map) === 'function') {
    return contacts.map((contact) => {
      return {
        url: `/contact/${contact.id}/details`,
        name: `${contact.first_name} ${contact.last_name}`,
        id: contact.id,
        company: {
          url: buildCompanyUrl(contact.company),
          name: contact.company.name,
          id: contact.company.id,
        },
      }
    })
  }

  return contacts
}

function mapInteractions (interactions) {
  if (interactions && (typeof interactions.map) === 'function') {
    return interactions.map((interaction) => {
      const company = typeof interaction.company === 'object' && interaction.company !== null ? interaction.company : null
      return {
        url: `/interaction/${interaction.id}/details`,
        id: interaction.id,
        subject: interaction.subject,
        company: {
          name: company ? company.name : null,
          url: company ? buildCompanyUrl(company) : null,
        },
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
  },
}
