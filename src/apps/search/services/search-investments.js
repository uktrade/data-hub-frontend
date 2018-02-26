const queryString = require('query-string')
const { assign } = require('lodash')

const authorisedRequest = require('../../../lib/authorised-request')
const config = require('../../../../config')

function searchInvestments ({ token, searchTerm, page = 1, limit = 10, filters = {} }) {
  const queryParams = {
    offset: (page * limit) - limit,
    limit,
  }
  const body = assign({}, filters, {
    original_query: searchTerm,
    searchEntity: 'investment_project',
  })

  const options = {
    url: `${config.apiRoot}/v3/search/investment_project?${queryString.stringify(queryParams)}`,
    method: 'POST',
    body,
  }

  return authorisedRequest(token, options)
    .then((result) => {
      result.page = page
      return result
    })
}

module.exports = searchInvestments
