const config = require('../config')
const authorisedRequest = require('../lib/authorised-request')

function getCompanyInvestmentProjects (token, companyId) {
  return authorisedRequest(token, `${config.apiRoot}/v3/investment/project?investor_company_id=${companyId}`)
}

module.exports = {
  getCompanyInvestmentProjects
}
