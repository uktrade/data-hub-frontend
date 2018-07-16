const config = require('../../../config')
const authorisedRequest = require('../../lib/authorised-request')

function fetchProposition (token, propositionId, investmentId) {
  return authorisedRequest(token, `${config.apiRoot}/v3/investment/${investmentId}/proposition/${propositionId}`)
}

function saveProposition (token, proposition) {
  const options = {
    url: `${config.apiRoot}/v3/investment/${proposition.investment_project}/proposition`,
    method: 'POST',
    body: proposition,
  }

  if (proposition.id) {
    options.url = `${options.url}/${proposition.id}`
    options.method = 'PATCH'
  }

  return authorisedRequest(token, options)
}

function abandonProposition (token, proposition) {
  const options = {
    url: `${config.apiRoot}/v3/investment/${proposition.investment_project}/proposition/${proposition.id}/abandon`,
    method: 'POST',
    body: proposition,
  }

  return authorisedRequest(token, options)
}

function completeProposition (token, proposition) {
  const options = {
    url: `${config.apiRoot}/v3/investment/${proposition.investment_project}/proposition/${proposition.id}/complete`,
    method: 'POST',
    body: proposition,
  }

  return authorisedRequest(token, options)
}

function completeUpload (token, proposition) {
  const options = {
    url: `${config.apiRoot}/v3/investment/${proposition.investment_project}/proposition/${proposition.id}/document`,
    method: 'POST',
    body: proposition,
  }

  return authorisedRequest(token, options)
}

/**
 * Get propositions for a investment
 *
 * @param {string} token
 * @param {string} investmentId
 * @param {number} page
 * @return {Promise<Object[]>} Returns a promise that resolves to an array of API proposition objects
 */
function getPropositionsForInvestment (token, investmentId, page) {
  const limit = 10
  const offset = limit * (page - 1)
  return authorisedRequest(token, `${config.apiRoot}/v3/investment/${investmentId}/proposition?&limit=${limit}&offset=${offset}`)
}

module.exports = {
  abandonProposition,
  completeProposition,
  completeUpload,
  saveProposition,
  fetchProposition,
  getPropositionsForInvestment,
}
