const config = require('../../../../../config/index')
const authorisedRequest = require('../../../../lib/authorised-request')

function getEvidenceForInvestment (token, investmentId) {
  return authorisedRequest(token, `${config.apiRoot}/v3/investment/${investmentId}/evidence-document`)
}

function addEvidence (token, evidence) {

  console.log('????????', evidence)
  const options = {
    url: `${config.apiRoot}/v3/investment/${evidence.investment}/evidence-document`,
    method: 'POST',
    body: evidence,
  }

  // return authorisedRequest(token, options)
}

function fetchDownloadLink (token, investmentId, evidenceId) {
  return authorisedRequest(token, `${config.apiRoot}/v3/investment/${investmentId}/evidence-document/${evidenceId}/download`)
}

module.exports = {
  addEvidence,
  fetchDownloadLink,
  getEvidenceForInvestment,
}
