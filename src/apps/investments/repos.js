const config = require('../../config')
const { authorisedRequest } = require('../../lib/authorised-request')

function getCompanyInvestmentProjects(req, companyId, page = 1) {
  const limit = 10
  const offset = limit * (page - 1)
  return authorisedRequest(
    req,
    `${config.apiRoot}/v3/investment?investor_company_id=${companyId}&limit=${limit}&offset=${offset}`
  )
}

function getInvestment(req, investmentId) {
  return authorisedRequest(
    req,
    `${config.apiRoot}/v3/investment/${investmentId}`
  )
}

function updateInvestment(req, investmentId, body) {
  return authorisedRequest(req, {
    url: `${config.apiRoot}/v3/investment/${investmentId}`,
    method: 'PATCH',
    body,
  })
}

function getInvestmentProjectAuditLog(req, investmentId, page = 1) {
  const limit = 10
  const offset = limit * (page - 1)
  return authorisedRequest(req, {
    url: `${config.apiRoot}/v3/investment/${investmentId}/audit`,
    qs: { limit, offset },
  })
}

function archiveInvestmentProject(req, investmentId, reason) {
  return authorisedRequest(req, {
    url: `${config.apiRoot}/v3/investment/${investmentId}/archive`,
    method: 'POST',
    body: {
      reason,
    },
  })
}

function unarchiveInvestmentProject(req, investmentId) {
  return authorisedRequest(req, {
    url: `${config.apiRoot}/v3/investment/${investmentId}/unarchive`,
    method: 'POST',
  })
}

async function updateInvestmentTeamMembers(
  req,
  investmentId,
  investmentTeamMembers
) {
  return authorisedRequest(req, {
    url: `${config.apiRoot}/v3/investment/${investmentId}/team-member`,
    method: 'PUT',
    body: investmentTeamMembers,
  })
}

module.exports = {
  getCompanyInvestmentProjects,
  getInvestment,
  updateInvestment,
  getInvestmentProjectAuditLog,
  archiveInvestmentProject,
  unarchiveInvestmentProject,
  updateInvestmentTeamMembers,
}
