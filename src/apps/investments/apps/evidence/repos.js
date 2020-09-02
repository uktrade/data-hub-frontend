const config = require('../../../../config')
const { authorisedRequest } = require('../../../../lib/authorised-request')

function getEvidenceForInvestment(req, investmentId) {
  return authorisedRequest(
    req,
    `${config.apiRoot}/v3/investment/${investmentId}/evidence-document`
  )
}

function fetchDownloadLink(req, investmentId, evidenceId) {
  return authorisedRequest(
    req,
    `${config.apiRoot}/v3/investment/${investmentId}/evidence-document/${evidenceId}/download`
  )
}

function requestDeleteEvidence(req, investmentId, evidenceId) {
  const options = {
    url: `${config.apiRoot}/v3/investment/${investmentId}/evidence-document/${evidenceId}`,
    method: 'DELETE',
  }

  return authorisedRequest(req, options)
}

module.exports = {
  fetchDownloadLink,
  getEvidenceForInvestment,
  requestDeleteEvidence,
}
