const winston = require('winston')
const authorisedRequest = require('../lib/authorised-request')
const config = require('../config')

function getInteraction (token, interactionId) {
  return authorisedRequest(token, `${config.apiRoot}/interaction/${interactionId}/`)
}

function saveInteraction (token, interaction) {
  const options = {
    body: interaction
  }

  if (interaction.id && interaction.id.length > 0) {
    // update
    options.url = `${config.apiRoot}/interaction/${interaction.id}/`
    options.method = 'PUT'
  } else {
    options.url = `${config.apiRoot}/interaction/`
    options.method = 'POST'
  }

  return authorisedRequest(token, options)
}

/**
 * Get all the interactions for a contact
 *
 * @param {any} token
 * @param {any} contactId
 * @return {Array[Object]} Returns a promise that resolves to an array of API interaction objects
 */
function getInteractionsForContact (token, contactId) {
  // TODO deal with pagination and move to the interaction API v3 endpoints when they are ready
  return new Promise((resolve) => {
    authorisedRequest(token, `${config.apiRoot}/interaction/?contact_id=${contactId}&limit=100`)
    .then((response) => {
      resolve(response.results)
    })
    .catch((error) => {
      winston.info(error)
      resolve([])
    })
  })
}

module.exports = {
  saveInteraction,
  getInteraction,
  getInteractionsForContact
}
