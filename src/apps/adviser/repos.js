const config = require('../../../config')
const logger = require('../../../config/logger')
const authorisedRequest = require('../../lib/authorised-request')

// TODO: Make sure this is removed and replaced with a better way to
// filter/select advisers
function getAdvisers (token) {
  return authorisedRequest(token, `${config.apiRoot}/adviser/?limit=100000&offset=0`)
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
