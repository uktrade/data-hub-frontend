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
 * Get interactions for an entity type
 *
 * @param {string} token
 * @param {string} entityQuery
 * @param {number} page
 * @return {Promise<Object[]>} Returns a promise that resolves to an array of API interaction objects
 */
function getInteractionsForEntity (token, entityQuery, page) {
  const limit = 10
  const offset = limit * (page - 1)
  return authorisedRequest(token, `${config.apiRoot}/v3/interaction?${entityQuery}&limit=${limit}&offset=${offset}`)
}

module.exports = {
  saveInteraction,
  fetchInteraction,
  getInteractionsForEntity,
}
