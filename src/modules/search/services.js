const queryString = require('qs')

const {
  authorisedRequest,
  authorisedRawRequest,
} = require('../../lib/authorised-request')
const config = require('../../config')

const buildOptions = (isAggregation, searchUrl, body, entity) => {
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
    url: `${searchUrl}${entity ? `/${entity}` : ''}`,
    method: 'POST',
  }
}

function search({
  req,
  searchTerm: term = '',
  searchEntity,
  requestBody,
  isAggregation = true,
  limit = 10,
  page = 1,
}) {
  const apiVersion = !isAggregation && searchEntity === 'company' ? 'v4' : 'v3'
  const searchUrl = `${config.apiRoot}/${apiVersion}/search`

  const body = {
    ...requestBody,
    limit,
    term,
    offset: page * limit - limit,
  }

  const options = buildOptions(isAggregation, searchUrl, body, searchEntity)

  return authorisedRequest(req, options).then((result) => {
    result.page = page
    return result
  })
}

function searchEntity(
  req,
  body,
  route,
  { apiVersion = 'v3', page = 1, limit = 10 }
) {
  const queryParams = {
    offset: page * limit - limit,
    limit,
  }

  const options = {
    body,
    url: `${
      config.apiRoot
    }/${apiVersion}/search/${route}?${queryString.stringify(queryParams)}`,
    method: 'POST',
  }

  return authorisedRequest(req, options).then((result) => {
    result.page = page
    return result
  })
}

function searchCompanies({
  req,
  searchTerm,
  isUkBased,
  page = 1,
  limit = 10,
  requestBody = {},
}) {
  return searchEntity(
    req,
    {
      ...requestBody,
      original_query: searchTerm,
      uk_based: isUkBased,
      isAggregation: false,
    },
    'company',
    { apiVersion: 'v4', page, limit }
  )
}

function searchInvestments({
  req,
  searchTerm,
  page = 1,
  limit = 10,
  filters = {},
}) {
  return searchEntity(
    req,
    {
      ...filters,
      original_query: searchTerm,
      searchEntity: 'investment_project',
    },
    'investment_project',
    { page, limit }
  )
}

function searchForeignCompanies({ req, searchTerm, page = 1, limit = 10 }) {
  return searchCompanies({
    req,
    searchTerm,
    page,
    limit,
    isUkBased: false,
  })
}

function exportSearch({ req, searchTerm = '', searchEntity, requestBody }) {
  const apiVersion = searchEntity === 'company' ? 'v4' : 'v3'
  const searchUrl = `${config.apiRoot}/${apiVersion}/search`
  // If the requested CSV export should contain policy feedback, we need to call
  // different export endpoint that will provide extra columns to match
  // Data Workspace export.
  const exportApp =
    requestBody && requestBody.was_policy_feedback_provided
      ? 'policy-feedback'
      : 'export'
  const url = `${searchUrl}/${searchEntity}/${exportApp}`
  const options = {
    url: url,
    method: 'POST',
    body: {
      ...requestBody,
      term: searchTerm,
    },
  }

  return authorisedRawRequest(req, options)
}

function searchAutocomplete({
  req,
  searchEntity,
  searchTerm = '',
  requestBody = {},
}) {
  const searchUrl = `${config.apiRoot}/v4/search/${searchEntity}/autocomplete?term=${searchTerm}`
  const body = {
    ...requestBody,
  }

  const options = buildOptions(true, searchUrl, body)

  return authorisedRequest(req, options).then((result) => {
    return result
  })
}

function searchDnbCompanies({ req, requestBody = {} }) {
  const url = `${config.apiRoot}/v4/dnb/company-search`
  const options = buildOptions(false, url, {
    ...requestBody,
    page_size: 100,
  })

  return authorisedRequest(req, options)
}

module.exports = {
  search,
  searchCompanies,
  searchForeignCompanies,
  searchInvestments,
  exportSearch,
  searchAutocomplete,
  searchDnbCompanies,
}
