const { assign } = require('lodash')

const authorisedRequest = require('../../lib/authorised-request')
const config = require('../../../config')

function search ({ token, searchTerm = '', searchEntity, requestBody, isAggregation = true, limit = 10, page = 1 }) {
  const searchUrl = `${config.apiRoot}/v3/search`
  let options = {
    url: isAggregation ? searchUrl : `${searchUrl}/${searchEntity}`,
    method: isAggregation ? 'GET' : 'POST',
  }
  requestBody = assign({}, requestBody, {
    term: searchTerm,
    limit,
    offset: (page * limit) - limit,
  })

  if (isAggregation) {
    options.qs = assign(requestBody, {
      entity: searchEntity,
    })
  } else {
    options.body = requestBody
  }

  return authorisedRequest(token, options)
    .then(result => {
      result.page = page
      return result
    })
}

module.exports = {
  search,
}
