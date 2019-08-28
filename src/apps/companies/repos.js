/* eslint camelcase: 0, prefer-promise-reject-errors: 0 */
const config = require('../../../config')
const { authorisedRequest } = require('../../lib/authorised-request')

function getDitCompany (token, id) {
  return authorisedRequest(token, `${config.apiRoot}/v4/company/${id}`)
}

function getDitCompanyFromList (token, id) {
  return authorisedRequest(token, {
    method: 'GET',
    url: `${config.apiRoot}/v4/user/company-list/${id}`,
  })
}

function addDitCompanyToList (token, id) {
  return authorisedRequest(token, {
    method: 'PUT',
    url: `${config.apiRoot}/v4/user/company-list/${id}`,
  })
}

function removeDitCompanyFromList (token, id) {
  return authorisedRequest(token, {
    method: 'DELETE',
    url: `${config.apiRoot}/v4/user/company-list/${id}`,
  })
}

function getCHCompany (token, id) {
  return authorisedRequest(token, `${config.apiRoot}/v4/ch-company/${id}`)
}

function saveCompany (token, company) {
  return company.id ? updateCompany(token, company.id, company) : addCompany(token, company)
}

function archiveCompany (token, companyId, reason) {
  const options = {
    body: { reason },
    url: `${config.apiRoot}/v4/company/${companyId}/archive`,
    method: 'POST',
  }
  return authorisedRequest(token, options)
}

function unarchiveCompany (token, companyId) {
  return authorisedRequest(token, {
    method: 'POST',
    url: `${config.apiRoot}/v4/company/${companyId}/unarchive`,
  })
}

function addCompany (token, body) {
  return authorisedRequest(token, {
    body,
    url: `${config.apiRoot}/v4/company`,
    method: 'POST',
  })
}

function updateCompany (token, companyId, body) {
  return authorisedRequest(token, {
    body,
    url: `${config.apiRoot}/v4/company/${companyId}`,
    method: 'PATCH',
  })
}

function getCompanyAuditLog (token, companyId, page = 1) {
  const limit = 10
  const offset = limit * (page - 1)
  return authorisedRequest(token, {
    url: `${config.apiRoot}/v4/company/${companyId}/audit`,
    qs: { limit, offset },
  })
}

function getCompanySubsidiaries (token, companyId, page = 1) {
  const limit = 10
  const offset = limit * (page - 1)
  return authorisedRequest(token, {
    url: `${config.apiRoot}/v4/company`,
    qs: {
      limit,
      offset,
      sortby: 'name',
      global_headquarters_id: companyId,
    },
  })
}

function getOneListGroupCoreTeam (token, companyId) {
  return authorisedRequest(token, {
    url: `${config.apiRoot}/v4/company/${companyId}/one-list-group-core-team`,
  })
}

module.exports = {
  saveCompany,
  getDitCompany,
  addDitCompanyToList,
  removeDitCompanyFromList,
  getDitCompanyFromList,
  getCHCompany,
  archiveCompany,
  unarchiveCompany,
  updateCompany,
  getCompanyAuditLog,
  getCompanySubsidiaries,
  getOneListGroupCoreTeam,
}
