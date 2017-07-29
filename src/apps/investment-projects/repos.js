const config = require('../../../config')
const authorisedRequest = require('../../lib/authorised-request')
const { getInflatedDitCompany } = require('../companies/services/data')

function getCompanyInvestmentProjects (token, companyId) {
  return authorisedRequest(token, `${config.apiRoot}/v3/investment?investor_company_id=${companyId}`)
}

function getInvestment (token, investmentId) {
  return authorisedRequest(token, `${config.apiRoot}/v3/investment/${investmentId}`)
}

function updateInvestment (token, investmentId, body) {
  return authorisedRequest(token, {
    url: `${config.apiRoot}/v3/investment/${investmentId}`,
    method: 'PATCH',
    body,
  })
}

function getEquityCompanyDetails (token, equityCompanyId) {
  const promises = [
    getInflatedDitCompany(token, equityCompanyId),
    getCompanyInvestmentProjects(token, equityCompanyId),
  ]

  return Promise.all(promises)
    .then(([equityCompany, equityCompanyInvestments]) => {
      return {
        equityCompany,
        equityCompanyInvestments,
      }
    })
}

function createInvestmentProject (token, body) {
  return authorisedRequest(token, {
    url: `${config.apiRoot}/v3/investment`,
    method: 'POST',
    body,
  })
}

function getInvestmentProjectAuditLog (token, investmentId) {
  return authorisedRequest(token, `${config.apiRoot}/v3/investment/${investmentId}/audit`)
    .then((data) => {
      return data.results
    })
}

function archiveInvestmentProject (token, investmentId, reason) {
  return authorisedRequest(token, {
    url: `${config.apiRoot}/v3/investment/${investmentId}/archive`,
    method: 'POST',
    body: {
      reason,
    },
  })
}

function unarchiveInvestmentProject (token, investmentId) {
  return authorisedRequest(token, {
    url: `${config.apiRoot}/v3/investment/${investmentId}/unarchive`,
    method: 'POST',
  })
}

async function updateInvestmentTeamMembers (token, investmentId, investmentTeamMembers) {
  // Todo - Delete all existing records before saving (in case an advisor was changes.)

  // Loop through each of the team members, saving it
  /*
  for (const investmentTeamMember of investmentTeamMembers) {
    await authorisedRequest(token, {
      url: `${config.apiRoot}/v3/investment/${investmentId}/team-member`,
      mothod: 'POST',
      body: {
        investment_project: investmentId,
        adviser: investmentTeamMember.adviser,
        role: investmentTeamMember.role,
      },
    })
  }
  */
}

module.exports = {
  getCompanyInvestmentProjects,
  getInvestment,
  updateInvestment,
  getEquityCompanyDetails,
  createInvestmentProject,
  getInvestmentProjectAuditLog,
  archiveInvestmentProject,
  unarchiveInvestmentProject,
  updateInvestmentTeamMembers,
}
