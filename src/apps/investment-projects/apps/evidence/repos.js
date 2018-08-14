const config = require('../../../../../config/index')
const authorisedRequest = require('../../../../lib/authorised-request')

function getEvidenceForInvestment (token, investmentId) {
  return authorisedRequest(token, `${config.apiRoot}/v3/investment/${investmentId}/evidence-document`)
}

function addEvidence (token, evidence) {
  const options = {
    url: `${config.apiRoot}/v3/investment/${evidence.investment_project}/evidence-document`,
    method: 'POST',
    body: evidence,
  }

  return authorisedRequest(token, options)
}

module.exports = {
  getEvidenceForInvestment,
  addEvidence,
}
