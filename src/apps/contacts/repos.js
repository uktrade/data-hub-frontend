const { sortBy } = require('lodash')
const { authorisedRequest } = require('../../lib/authorised-request')
const config = require('../../config')

function getContact(req, contactId) {
  return authorisedRequest(req, `${config.apiRoot}/v3/contact/${contactId}`)
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
