const logger = require('../../../config/logger')
const authorisedRequest = require('../../lib/authorised-request')
const config = require('../../../config')

function getContact (token, contactId) {
  return authorisedRequest(token, `${config.apiRoot}/v3/contact/${contactId}`)
}

function saveContact (token, contact) {
  let options = {
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

  return authorisedRequest(token, options)
}

function archiveContact (token, contactId, reason) {
  const options = {
    body: { reason },
    url: `${config.apiRoot}/v3/contact/${contactId}/archive`,
    method: 'POST',
  }
  return authorisedRequest(token, options)
}

function unarchiveContact (token, contactId) {
  return authorisedRequest(token, {
    method: 'POST',
    url: `${config.apiRoot}/v3/contact/${contactId}/unarchive`,
  })
}

function getContactsForCompany (token, companyId) {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await authorisedRequest(token, {
        url: `${config.apiRoot}/v3/contact`,
        qs: {
          company_id: companyId,
        },
      })
      resolve(response.results)
    } catch (error) {
      logger.error(error)
      reject(error)
    }
  })
}

function getContactAuditLog (token, contactId) {
  return authorisedRequest(token, `${config.apiRoot}/v3/contact/${contactId}/audit`)
}

module.exports = {
  getContact,
  saveContact,
  archiveContact,
  unarchiveContact,
  getContactsForCompany,
  getContactAuditLog,
}
