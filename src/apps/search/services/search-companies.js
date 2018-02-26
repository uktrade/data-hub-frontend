const queryString = require('query-string')

const authorisedRequest = require('../../../lib/authorised-request')
const config = require('../../../../config')

function searchCompanies ({ token, searchTerm, isUkBased, page = 1, limit = 10 }) {
  const queryParams = {
    offset: (page * limit) - limit,
    limit,
  }
  const body = {
    original_query: searchTerm,
    uk_based: isUkBased,
    isAggregation: false,
  }
  const options = {
    url: `${config.apiRoot}/v3/search/company?${queryString.stringify(queryParams)}`,
    method: 'POST',
    body,
  }

  return authorisedRequest(token, options)
    .then(result => {
      result.page = page

      return result
    })
}

module.exports = searchCompanies
