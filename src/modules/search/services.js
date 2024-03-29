const {
  authorisedRequest,
  authorisedRawRequest,
} = require('../../lib/authorised-request')
const config = require('../../config')
const {
  transformLandDateFilters,
} = require('../../client/modules/Investments/Projects/landDateTransformer')

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

const mergeSectorAndSubSectorParams = (requestBody) => {
  const { sub_sector_descends, sector_descends, ...reqBody } = requestBody
  const mergedSectors = [
    ...(sector_descends ? sector_descends : []),
    ...(sub_sector_descends ? sub_sector_descends : []),
  ]

  return mergedSectors.length
    ? { ...reqBody, sector_descends: mergedSectors }
    : reqBody
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

function exportSearch({ req, searchTerm = '', searchEntity, requestBody }) {
  let apiVersion
  let transformedRequestBody
  if (
    ['large-investor-profile', 'large-capital-opportunity', 'company'].includes(
      searchEntity
    )
  ) {
    apiVersion = 'v4'
  } else {
    apiVersion = 'v3'
  }
  if (searchEntity == 'investment_project') {
    transformedRequestBody = transformLandDateFilters(requestBody)
  } else {
    transformedRequestBody = mergeSectorAndSubSectorParams(requestBody)
  }
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
      ...transformedRequestBody,
      term: searchTerm,
    },
    responseType: 'stream',
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
  exportSearch,
  searchAutocomplete,
  searchDnbCompanies,
  mergeSectorAndSubSectorParams,
}
