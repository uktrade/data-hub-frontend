const config = require('../../../config')
const logger = require('../../../config/logger')
const authorisedRequest = require('../../lib/authorised-request')
const { filterDisabledOption } = require('../filters')

// TODO: advisers with no name are filtered on the front end. Make changes on
// the back end to make this not necessary.

function adviserHasName (adviser) {
  return Boolean(adviser.first_name || adviser.last_name)
}

/**
 *
 * @param {string} options token Session token for API calls
 * @param {boolean} options.includeDisabled Should the response include advisers marked as disabled?
 * @param {string} options.currentAdviser The ID of an adviser that should be included in the list irrespective of if
 *                                the list excludes disabled advisers and the adviser is disabled.
 * @returns {promise[Array]} Returns an array of adviser objects
 */
async function getAdvisers ({ token, includeDisabled = true, currentAdviser = null }) {
  const { results } = await authorisedRequest(token, `${config.apiRoot}/adviser/?limit=100000&offset=0`)

  if (includeDisabled) {
    return results.filter(adviserHasName)
  }

  return results
    .filter(filterDisabledOption(currentAdviser))
    .filter(adviserHasName)
}

function getAdviser (token, id) {
  return authorisedRequest(token, `${config.apiRoot}/adviser/${id}/`)
}

function adviserSearch (token, term) {
  return new Promise(async (resolve, reject) => {
    try {
      if (!term || term.trim().length === 0) {
        return resolve(null)
      }

      const parts = term.trim().toLowerCase().split(' ')
      let url = `${config.apiRoot}/adviser/?first_name__icontains=${parts[0]}`
      if (parts.length > 1) url += `&last_name__icontains=${parts[1]}`

      const data = await authorisedRequest(token, { url })

      // API only supports contains, so filter out results that don't start with term
      // Then reduce the result down to id and name
      // And finally sort things
      const filtered = data.results.filter((adviser) => {
        if (parts.length === 1) {
          return adviser.first_name.toLowerCase().startsWith(parts[0])
        }
        return adviser.first_name.toLowerCase().startsWith(parts[0]) && adviser.last_name.toLowerCase().startsWith(parts[1])
      })
        .map((adviser) => {
          return { id: adviser.id, name: `${adviser.first_name} ${adviser.last_name}` }
        })
        .sort((a, b) => {
          if (a.name.toLowerCase() < b.name.toLowerCase()) return -1
          if (a.name.toLowerCase() > b.name.toLowerCase()) return 1
          return 0
        })

      resolve(filtered)
    } catch (error) {
      logger.error(error)
      reject(error)
    }
  })
}

module.exports = {
  getAdvisers,
  getAdviser,
  adviserSearch,
}
