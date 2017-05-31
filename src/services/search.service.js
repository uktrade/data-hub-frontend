const Q = require('q')
const winston = require('winston')
const authorisedRequest = require('../lib/authorised-request')
const config = require('../config')
const { buildQueryString } = require('../lib/url-helpers')

function search ({ token, searchTerm, searchType, limit = 10, page = 1 }) {
  const params = {
    term: searchTerm,
    entity: searchType,
    limit,
    offset: (page * limit) - limit
  }

  const options = {
    url: `${config.apiRoot}/v3/search${buildQueryString(params)}`,
    method: 'GET'
  }

  return authorisedRequest(token, options)
    .then(result => {
      result.page = page

      return result
    })
}

function suggestCompany (token, term, types) {
  if (!types) {
    types = ['company_company']
  }
  const options = {
    url: `${config.apiRoot}/search/`,
    body: {
      term,
      doc_type: types,
      limit: 10,
      offset: 0
    },
    method: 'POST'
  }

  return authorisedRequest(token, options)
    .then((result) => {
      winston.debug('suggestion raw result', result)
      return result.hits
        .map((hit) => ({
          name: hit._source.name,
          id: hit._id,
          _type: hit._type
        }))
    })
    .catch((error) => {
      winston.error('Error calling auth reguest for suggestions', error)
    })
}

function searchLimited (token, term) {
  return new Promise((resolve, reject) => {
    Q.spawn(function * () {
      try {
        const allResults = yield search({ token, term, filters: ['company_company', 'company_companieshousecompany'] })
        const filtered = allResults.hits.filter(result => (result._type === 'company_companieshousecompany' ||
          (result._source.business_type && result._source.business_type.toLowerCase() === 'private limited company') ||
          (result._source.business_type && result._source.business_type.toLowerCase() === 'public limited company')))

        resolve(filtered)
      } catch (error) {
        winston.error(error)
        reject(error)
      }
    })
  })
}

module.exports = { search, suggestCompany, searchLimited }
