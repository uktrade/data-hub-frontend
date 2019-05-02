const queryString = require('qs')
const { assign } = require('lodash')

const { authorisedRequest } = require('../../lib/authorised-request')
const config = require('../../../config')

const buildOptions = (
  isAggregation,
  searchUrl,
  body,
  entity,
) => {
  if (isAggregation) {
    return {
      url: searchUrl,
      method: 'GET',
      qs: {
        ...body,
        entity,
      },
    }
  }

  return {
    body,
    url: `${searchUrl}/${entity}`,
    method: 'POST',
  }
}

function search ({
  token,
  searchTerm: term = '',
  searchEntity,
  requestBody,
  isAggregation = true,
  limit = 10,
  page = 1,
}) {
  const searchUrl = `${config.apiRoot}/v3/search`

  const body = {
    ...requestBody,
    limit,
    term,
    offset: (page * limit) - limit,
  }

  const options = buildOptions(
    isAggregation,
    searchUrl,
    body,
    searchEntity,
  )

  return authorisedRequest(token, options)
    .then(result => {
      result.page = page
      return result
    })
}

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

function searchForeignCompanies (options) {
  const optionsUkBasedFalse = assign({}, options, { isUkBased: false })

  return searchCompanies(optionsUkBasedFalse)
}

function searchLimitedCompanies ({ token, searchTerm, page = 1, limit = 10 }) {
  const queryParams = {
    offset: (page * limit) - limit,
    limit,
  }
  const body = {
    original_query: searchTerm,
  }

  const options = {
    url: `${config.apiRoot}/v3/search/companieshousecompany?${queryString.stringify(queryParams)}`,
    method: 'POST',
    body,
  }

  return authorisedRequest(token, options)
    .then((result) => {
      result.page = page
      return result
    })
}

module.exports = {
  search,
  searchCompanies,
  searchLimitedCompanies,
  searchForeignCompanies,
  searchInvestments,
}
