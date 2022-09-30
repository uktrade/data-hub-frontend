const { sortBy } = require('lodash')
const { authorisedRequest } = require('../../lib/authorised-request')
const config = require('../../config')

function getContact(req, contactId) {
  return authorisedRequest(req, `${config.apiRoot}/v4/contact/${contactId}`)
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

module.exports = {
  getContact,
  unarchiveContact,
  getContactsForCompany,
}
