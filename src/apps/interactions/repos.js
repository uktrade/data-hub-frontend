const config = require('../../../config')
const authorisedRequest = require('../../lib/authorised-request')

function getInteraction (token, interactionId) {
  return authorisedRequest(token, `${config.apiRoot}/interaction/${interactionId}/`)
}

function saveInteraction (token, interaction) {
  const options = {
    body: interaction,
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

// TODO we have multiple ways of doing things in this file - this needs tidying up
function getInteractionsForInvestment (token, investmentId) {
  return authorisedRequest(token, `${config.apiRoot}/interaction/?investment_project_id=${investmentId}`)
}

function createInvestmentInteraction (token, body) {
  return authorisedRequest(token, {
    url: `${config.apiRoot}/interaction/`,
    method: 'POST',
    body,
  })
}

function updateInvestmentInteraction (token, interactionId, body) {
  return authorisedRequest(token, {
    url: `${config.apiRoot}/interaction/${interactionId}/`,
    method: 'PUT',
    body,
  })
}

module.exports = {
  saveInteraction,
  getInteraction,
  getInteractionsForCompany,
  getInteractionsForContact,
  getInteractionsForInvestment,
  createInvestmentInteraction,
  updateInvestmentInteraction,
}
