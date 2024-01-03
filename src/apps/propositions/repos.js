const config = require('../../config')
const { authorisedRequest } = require('../../lib/authorised-request')

function fetchProposition(req, propositionId, investmentId) {
  return authorisedRequest(
    req,
    `${config.apiRoot}/v3/investment/${investmentId}/proposition/${propositionId}`
  )
}

function fetchDownloadLink(req, propositionId, investmentId, documentId) {
  return authorisedRequest(
    req,
    `${config.apiRoot}/v3/investment/${investmentId}/proposition/${propositionId}/document/${documentId}/download`
  )
}

function completeProposition(req, res) {
  const options = {
    url: `${config.apiRoot}/v3/investment/${res.locals.investment.id}/proposition/${req.params.propositionId}/complete`,
    method: 'POST',
  }

  return authorisedRequest(req.session.req, options)
}

module.exports = {
  completeProposition,
  fetchDownloadLink,
  fetchProposition,
}
