const Q = require('q')
const winston = require('winston')
const authorisedRequest = require('../lib/authorised-request')
const config = require('../config')

function getAdvisors (token) {
  return authorisedRequest(token, `${config.apiRoot}/advisor/`)
}

function getAdvisor (token, id) {
  return authorisedRequest(token, `${config.apiRoot}/advisor/${id}/`)
}

function advisorSearch (token, term) {
  return new Promise((resolve, reject) => {
    Q.spawn(function * () {
      try {
        if (!term || term.trim().length === 0) {
          return resolve(null)
        }

        const parts = term.trim().toLowerCase().split(' ')
        let url = `${config.apiRoot}/advisor/?first_name__icontains=${parts[0]}`
        if (parts.length > 1) url += `&last_name__icontains=${parts[1]}`

        const data = yield authorisedRequest(token, { url })

        // API only supports contains, so filter out results that don't start with term
        // Then reduce the result down to id and name
        // And finally sort things
        const filtered = data.results.filter((advisor) => {
          if (parts.length === 1) {
            return advisor.first_name.toLowerCase().startsWith(parts[0])
          }
          return advisor.first_name.toLowerCase().startsWith(parts[0]) && advisor.last_name.toLowerCase().startsWith(parts[1])
        })
        .map((advisor) => {
          return {id: advisor.id, name: `${advisor.first_name} ${advisor.last_name}`}
        })
        .sort((a, b) => {
          if (a.name.toLowerCase() < b.name.toLowerCase()) return -1
          if (a.name.toLowerCase() > b.name.toLowerCase()) return 1
          return 0
        })

        resolve(filtered)
      } catch (error) {
        winston.error(error)
        reject(error)
      }
    })
  })
}

module.exports = {
  getAdvisors,
  getAdvisor,
  advisorSearch
}
