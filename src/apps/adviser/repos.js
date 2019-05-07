const { get } = require('lodash')
const config = require('../../../config')
const { authorisedRequest } = require('../../lib/authorised-request')

function getAdvisers (token) {
  return authorisedRequest(token, `${config.apiRoot}/adviser/?limit=100000&offset=0`)
    .then(response => {
      const results = response.results.filter(adviser => get(adviser, 'name', '').trim().length)

      return {
        results,
        count: results.length,
      }
    })
}

function getAdviser (token, id) {
  return authorisedRequest(token, `${config.apiRoot}/adviser/${id}/`)
}

async function fetchAdviserSearchResults (token, params) {
  const isActive = params.is_active ? '&is_active=true' : ''
  const url = `${config.apiRoot}/adviser/?autocomplete=${params.term}${isActive}`
  const adviserResults = await authorisedRequest(token, { url })
  return adviserResults.results
}

module.exports = {
  getAdvisers,
  getAdviser,
  fetchAdviserSearchResults,
}
