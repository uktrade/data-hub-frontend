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

module.exports = {
  saveInteraction,
  fetchInteraction,
}
