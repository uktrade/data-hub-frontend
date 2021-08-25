const { sortBy } = require('lodash')
const { authorisedRequest } = require('../../lib/authorised-request')
const config = require('../../config')

// getContact() and saveContact() are the only ones that are going to need to be switchable to v4
// is this used outside of contacts stuff what?
//this code is used in like two places that aren't specifically to do with contacts?
// I think I can safely say that this is at the very least untested, if not completely dead code
function getContact(req, contactId, features = {}) {
  const addressAreaValidationEnabled =
    features['address-area-contact-required-field']
  const endpointVersion = addressAreaValidationEnabled ? 'v4' : 'v3'
  return authorisedRequest(
    req,
    `${config.apiRoot}/${endpointVersion}/contact/${contactId}`
  )
}

function saveContact(req, contact) {
  const options = {
    body: contact,
  }

  if (contact.id && contact.id.length > 0) {
    // update
    options.url = `${config.apiRoot}/v3/contact/${contact.id}`
    options.method = 'PATCH'
  } else {
    options.url = `${config.apiRoot}/v3/contact`
    options.method = 'POST'
  }

  return authorisedRequest(req, options)
}

function archiveContact(req, contactId, reason) {
  const options = {
    body: { reason },
    url: `${config.apiRoot}/v3/contact/${contactId}/archive`,
    method: 'POST',
  }
  return authorisedRequest(req, options)
}

function unarchiveContact(req, contactId) {
  return authorisedRequest(req, {
    method: 'POST',
    url: `${config.apiRoot}/v3/contact/${contactId}/unarchive`,
  })
}

async function getContactsForCompany(req, companyId) {
  const response = await authorisedRequest(req, {
    url: `${config.apiRoot}/v3/contact`,
    qs: {
      company_id: companyId,
      limit: 500,
    },
  })
  return sortBy(response.results, [(name) => name.first_name])
}

function getContactAuditLog(req, contactId, page = 1) {
  const limit = 10
  const offset = limit * (page - 1)
  return authorisedRequest(
    req,
    `${config.apiRoot}/v3/contact/${contactId}/audit?limit=${limit}&offset=${offset}`
  )
}

module.exports = {
  getContact,
  saveContact,
  archiveContact,
  unarchiveContact,
  getContactsForCompany,
  getContactAuditLog,
}
