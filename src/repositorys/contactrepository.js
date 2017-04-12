const authorisedRequest = require('../lib/authorisedrequest')
const config = require('../config')

function getContact (token, contactId) {
  return authorisedRequest(token, `${config.apiRoot}/contact/${contactId}/`)
}

function saveContact (token, contact) {
  let options = {
    body: contact
  }

  if (contact.address_same_as_company) {
    delete contact.address_1
    delete contact.address_2
    delete contact.address_3
    delete contact.address_4
    delete contact.address_town
    delete contact.address_county
    delete contact.address_country
    delete contact.address_postcode
  }

  if (contact.id && contact.id.length > 0) {
    // update
    options.url = `${config.apiRoot}/contact/${contact.id}/`
    options.method = 'PUT'
  } else {
    options.url = `${config.apiRoot}/contact/`
    options.method = 'POST'
  }

  return authorisedRequest(token, options)
}

function archiveContact (token, contactId, reason) {
  const options = {
    body: { reason },
    url: `${config.apiRoot}/contact/${contactId}/archive/`,
    method: 'POST'
  }
  return authorisedRequest(token, options)
}

function unarchiveContact (token, contactId) {
  return authorisedRequest(token, `${config.apiRoot}/contact/${contactId}/unarchive/`)
}

module.exports = { getContact, saveContact, archiveContact, unarchiveContact }
