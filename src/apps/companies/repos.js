/* eslint camelcase: 0, prefer-promise-reject-errors: 0 */
const config = require('../../config')
const { authorisedRequest } = require('../../lib/authorised-request')

function getDitCompany(req, id) {
  return authorisedRequest(req, `${config.apiRoot}/v4/company/${id}`)
}

function getDitCompanyFromList(req, id) {
  return authorisedRequest(req, {
    method: 'GET',
    url: `${config.apiRoot}/v4/user/company-list/${id}`,
  })
}

function addDitCompanyToList(req, id) {
  return authorisedRequest(req, {
    method: 'PUT',
    url: `${config.apiRoot}/v4/user/company-list/${id}`,
  })
}

function removeDitCompanyFromList(req, id) {
  return authorisedRequest(req, {
    method: 'DELETE',
    url: `${config.apiRoot}/v4/user/company-list/${id}`,
  })
}

function saveCompany(req, company) {
  return company.id
    ? updateCompany(req, company.id, company)
    : addCompany(req, company)
}

function archiveCompany(req, companyId, reason) {
  const options = {
    body: { reason },
    url: `${config.apiRoot}/v4/company/${companyId}/archive`,
    method: 'POST',
  }
  return authorisedRequest(req, options)
}

function unarchiveCompany(req, companyId) {
  return authorisedRequest(req, {
    method: 'POST',
    url: `${config.apiRoot}/v4/company/${companyId}/unarchive`,
  })
}

function addCompany(req, body) {
  return authorisedRequest(req, {
    body,
    url: `${config.apiRoot}/v4/company`,
    method: 'POST',
  })
}

function updateCompany(req, companyId, body) {
  return authorisedRequest(req, {
    body,
    url: `${config.apiRoot}/v4/company/${companyId}`,
    method: 'PATCH',
  })
}

function getCompanyAuditLog(req, companyId, page = 1) {
  const limit = 10
  const offset = limit * (page - 1)
  return authorisedRequest(req, {
    url: `${config.apiRoot}/v4/company/${companyId}/audit`,
    qs: { limit, offset },
  })
}

function getCompanySubsidiaries(req, companyId, page = 1) {
  const limit = 10
  const offset = limit * (page - 1)
  return authorisedRequest(req, {
    url: `${config.apiRoot}/v4/company`,
    qs: {
      limit,
      offset,
      sortby: 'name',
      global_headquarters_id: companyId,
    },
  })
}

function getGlobalUltimateHierarchy(req, globalUltimateDunnsNumber) {
  return authorisedRequest(req, {
    url: `${config.apiRoot}/v4/company`,
    qs: {
      limit: 200,
      global_ultimate_duns_number: globalUltimateDunnsNumber,
    },
  })
}

function getOneListGroupCoreTeam(req, companyId) {
  return authorisedRequest(req, {
    url: `${config.apiRoot}/v4/company/${companyId}/one-list-group-core-team`,
  })
}

function saveDnbCompany(req, dunsNumber) {
  return authorisedRequest(req, {
    body: {
      duns_number: dunsNumber,
    },
    url: `${config.apiRoot}/v4/dnb/company-create`,
    method: 'POST',
  })
}

function createDnbCompanyInvestigation(req, body) {
  return authorisedRequest(req, {
    body,
    url: `${config.apiRoot}/v4/dnb/company-investigation`,
    method: 'POST',
  })
}

function saveCompanyExportDetails(req, companyId, body) {
  return authorisedRequest(req, {
    body,
    url: `${config.apiRoot}/v4/company/${companyId}/export-detail`,
    method: 'PATCH',
  })
}

function linkDataHubCompanyToDnBCompany(req, companyId, dunsNumber) {
  return authorisedRequest(req, {
    body: {
      company_id: companyId,
      duns_number: dunsNumber,
    },
    url: `${config.apiRoot}/v4/dnb/company-link`,
    method: 'POST',
  })
}

function createDnbChangeRequest(req, dunsNumber, changes) {
  return authorisedRequest(req, {
    body: {
      duns_number: dunsNumber,
      changes,
    },
    url: `${config.apiRoot}/v4/dnb/company-change-request`,
    method: 'POST',
  })
}

module.exports = {
  saveCompany,
  getDitCompany,
  addDitCompanyToList,
  removeDitCompanyFromList,
  getDitCompanyFromList,
  archiveCompany,
  unarchiveCompany,
  updateCompany,
  getCompanyAuditLog,
  getCompanySubsidiaries,
  getGlobalUltimateHierarchy,
  getOneListGroupCoreTeam,
  saveDnbCompany,
  createDnbCompanyInvestigation,
  saveCompanyExportDetails,
  linkDataHubCompanyToDnBCompany,
  createDnbChangeRequest,
}
