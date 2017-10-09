const config = require('../../../config')
const authorisedRequest = require('../../lib/authorised-request')

function fetchInteraction (token, interactionId) {
  return authorisedRequest(token, `${config.apiRoot}/v3/interaction/${interactionId}`)
}

function saveInteraction (token, interaction) {
  const options = {
    url: `${config.apiRoot}/v3/interaction`,
    method: 'POST',
    body: interaction,
  }

  if (interaction.id) {
    options.url = `${options.url}/${interaction.id}`
    options.method = 'PATCH'
  }

  return authorisedRequest(token, options)
}

/**
 * Get interactions for a investment
 *
 * @param {string} token
 * @param {string} investmentId
 * @param {number} page
 * @return {Promise<Object[]>} Returns a promise that resolves to an array of API interaction objects
 */
function getInteractionsForInvestment (token, investmentId, page) {
  const limit = 10
  const offset = limit * (page - 1)
  return authorisedRequest(token, `${config.apiRoot}/v3/interaction?investment_project_id=${investmentId}&limit=${limit}&offset=${offset}`)
}

module.exports = {
  saveInteraction,
  fetchInteraction,
  getInteractionsForInvestment,
}
