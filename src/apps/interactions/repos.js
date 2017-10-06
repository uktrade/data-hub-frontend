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
 * Get all the interactions for a contact
 *
 * @param {string} token
 * @param {string} contactId
 * @param {number} page
 * @return {Array[Object]} Returns a promise that resolves to an array of API interaction objects
 */
function getInteractionsForContact (token, contactId, page = 1) {
  const limit = 10
  const offset = limit * (page - 1)
  return authorisedRequest(token, `${config.apiRoot}/v3/interaction?contact_id=${contactId}&limit=${limit}&offset=${offset}`)
}

/**
 * Get interactions for a company
 *
 * @param {string} token
 * @param {string} companyId
 * @param {number} page
 * @return {Promise<Object[]>} Returns a promise that resolves to an array of API interaction objects
 */
function getInteractionsForCompany (token, companyId, page = 1) {
  const limit = 10
  const offset = limit * (page - 1)
  return authorisedRequest(token, `${config.apiRoot}/v3/interaction?company_id=${companyId}&limit=${limit}&offset=${offset}`)
}

function getInteractionsForInvestment (token, investmentId, page) {
  const limit = 10
  const offset = limit * (page - 1)
  return authorisedRequest(token, `${config.apiRoot}/v3/interaction?investment_project_id=${investmentId}&limit=${limit}&offset=${offset}`)
}

module.exports = {
  saveInteraction,
  fetchInteraction,
  getInteractionsForCompany,
  getInteractionsForContact,
  getInteractionsForInvestment,
}
