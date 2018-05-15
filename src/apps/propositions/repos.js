const config = require('../../../config')
const authorisedRequest = require('../../lib/authorised-request')

function fetchProposition (token, propositionId) {
  console.log('>>>>>>>>>>>>>>>>> fetchProposition <<<<<<<<<<<<<<<<<<<')

  return authorisedRequest(token, `${config.apiRoot}/v3/proposition/${propositionId}`)
  // return authorisedRequest(token, 'http://localhost:57342/proposition-mock')
}

function saveProposition (token, proposition) {
  const options = {
    url: `${config.apiRoot}/v3/proposition`,
    method: 'POST',
    body: proposition,
  }

  if (proposition.id) {
    options.url = `${options.url}/${proposition.id}`
    options.method = 'PATCH'
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
  console.log('>>>>>>>>>>>>>>>>> !!! <<<<<<<<<<<<<<<<<<<')
  return authorisedRequest(token, `${config.apiRoot}/v3/interaction?investment_project_id=${investmentId}&limit=${limit}&offset=${offset}`)
  // return authorisedRequest(token, 'http://localhost:57342/propositions-collection-mock')
}

module.exports = {
  saveProposition,
  fetchProposition,
  getPropositionsForInvestment,
}
