const config = require('../config')
const authorisedRequest = require('../lib/authorised-request')

function getCompanyInvestmentProjects (token, companyId) {
  return authorisedRequest(token, `${config.apiRoot}/v3/investment/project?investor_company_id=${companyId}`)
}

function getInvestmentProjectSummary (token, investmentId) {
  return authorisedRequest(token, `${config.apiRoot}/v3/investment/${investmentId}/project`)
}

function getInvestmentValue (token, investmentId) {
  return authorisedRequest(token, `${config.apiRoot}/v3/investment/${investmentId}/value`)
}

function getInvestmentRequirements (token, investmentId) {
  return authorisedRequest(token, `${config.apiRoot}/v3/investment/${investmentId}/requirements`)
}

function createInvestmentProject (token, body) {
  return authorisedRequest(token, {
    url: `${config.apiRoot}/v3/investment/project`,
    method: 'POST',
    body,
  })
}

function updateInvestmentProject (token, investmentId, body) {
  return authorisedRequest(token, {
    url: `${config.apiRoot}/v3/investment/${investmentId}/project`,
    method: 'PATCH',
    body,
  })
}

module.exports = {
  getCompanyInvestmentProjects,
  getInvestmentProjectSummary,
  getInvestmentValue,
  getInvestmentRequirements,
  createInvestmentProject,
  updateInvestmentProject,
}
