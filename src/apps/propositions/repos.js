const config = require('../../config')
const { authorisedRequest } = require('../../lib/authorised-request')

function fetchProposition(req, propositionId, investmentId) {
  return authorisedRequest(
    req,
    `${config.apiRoot}/v3/investment/${investmentId}/proposition/${propositionId}`
  )
}

function fetchPropositionFiles(req, propositionId, investmentId) {
  return authorisedRequest(
    req,
    `${config.apiRoot}/v3/investment/${investmentId}/proposition/${propositionId}/document`
  )
}

function fetchDownloadLink(req, propositionId, investmentId, documentId) {
  return authorisedRequest(
    req,
    `${config.apiRoot}/v3/investment/${investmentId}/proposition/${propositionId}/document/${documentId}/download`
  )
}

function saveProposition(req, proposition) {
  const options = {
    url: `${config.apiRoot}/v3/investment/${proposition.investment_project}/proposition`,
    method: 'POST',
    body: proposition,
  }

  if (proposition.id) {
    options.url = `${options.url}/${proposition.id}`
    options.method = 'PATCH'
  }

  return authorisedRequest(req, options)
}

function abandonProposition(req, proposition) {
  const options = {
    url: `${config.apiRoot}/v3/investment/${proposition.investment_project}/proposition/${proposition.id}/abandon`,
    method: 'POST',
    body: proposition,
  }

  return authorisedRequest(req, options)
}

function completeProposition(req, res) {
  const options = {
    url: `${config.apiRoot}/v3/investment/${res.locals.investment.id}/proposition/${req.params.propositionId}/complete`,
    method: 'POST',
  }

  return authorisedRequest(req.session.req, options)
}

/**
 * Get propositions for a investment
 *
 * @param {string} req
 * @param {string} investmentId
 * @param {number} page
 * @return {Promise<Object[]>} Returns a promise that resolves to an array of API proposition objects
 */
function getPropositionsForInvestment(req, investmentId, page) {
  const limit = 10
  const offset = limit * (page - 1)
  return authorisedRequest(
    req,
    `${config.apiRoot}/v3/investment/${investmentId}/proposition?&limit=${limit}&offset=${offset}`
  )
}

module.exports = {
  abandonProposition,
  completeProposition,
  fetchDownloadLink,
  fetchProposition,
  fetchPropositionFiles,
  getPropositionsForInvestment,
  saveProposition,
}
