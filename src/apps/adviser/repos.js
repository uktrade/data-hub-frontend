const config = require('../../config')
const { authorisedRequest } = require('../../lib/authorised-request')

function getAdviser(req, id) {
  return authorisedRequest(req, `${config.apiRoot}/adviser/${id}/`)
}

async function fetchAdviserSearchResults(req, params) {
  const isActive = params.is_active ? '&is_active=true' : ''
  const url = `${config.apiRoot}/adviser/?autocomplete=${params.term}${isActive}`
  const adviserResults = await authorisedRequest(req, { url })
  return adviserResults.results
}

module.exports = {
  getAdviser,
  fetchAdviserSearchResults,
}
