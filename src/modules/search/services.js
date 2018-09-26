const authorisedRequest = require('../../lib/authorised-request')
const authorisedRawRequest = require('../../lib/authorised-raw-request')
const config = require('../../../config')

function search ({ token, searchTerm = '', searchEntity, requestBody, isAggregation = true, limit = 10, page = 1 }) {
  const searchUrl = `${config.apiRoot}/v3/search`
  let options = {
    url: isAggregation ? searchUrl : `${searchUrl}/${searchEntity}`,
    method: isAggregation ? 'GET' : 'POST',
  }
  requestBody = {
    ...requestBody,
    term: searchTerm,
    limit,
    offset: (page * limit) - limit,
  }

  if (isAggregation) {
    options.qs = {
      ...requestBody,
      entity: searchEntity,
    }
  } else {
    options.body = requestBody
  }

  return authorisedRequest(token, options)
    .then(result => {
      result.page = page
      return result
    })
}

function exportSearch ({ res, token, searchTerm = '', searchEntity, requestBody }) {
  const searchUrl = `${config.apiRoot}/v3/search`
  let options = {
    url: `${searchUrl}/${searchEntity}/export`,
    method: 'POST',
  }

  requestBody = {
    ...requestBody,
    term: searchTerm,
  }

  options.body = requestBody

  return authorisedRawRequest(token, options)
    .then(req => {
      res.attachment(searchEntity + '.csv')
      res.type('txt')
      req.pipe(res)
      return req
    })
}

module.exports = {
  exportSearch,
  search,
}
