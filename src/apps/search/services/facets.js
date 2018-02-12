const { assign, get, forEach, sortBy, isArray, isString } = require('lodash')

const authorisedRequest = require('../../../lib/authorised-request')
const config = require('../../../../config')

const FACET_FIELDS = {
  'company': ['sector', 'registered_address_country', 'uk_region'],
  'contact': ['company_sector', 'address_country'],
  'event': ['event_type', 'address_country', 'uk_region', 'organiser'],
  'interaction': ['kind', 'communication_channel', 'dit_adviser', 'dit_team'],
  'investment_project': ['stage', 'investment_type', 'sector', 'status', 'uk_region_locations', 'investor_company_country'],
}
async function facets ({ token, searchTerm, searchEntity, requestBody }) {
  const response = await facetSearch({
    token,
    searchTerm,
    searchEntity,
    requestBody,
    limit: 10000,
    isAggregation: false,
  })

  const results = response.results
  const fields = FACET_FIELDS[searchEntity]
  const facets = calculateFacets(results, fields)

  const options = {}

  fields.forEach((field) => {
    options[field] = transformFacetToOptions(facets[field])
  })

  return options
}

function calculateFacets (results, fields) {
  const facets = {}

  fields.forEach(field => {
    facets[field] = {}
  })

  results.forEach((result) => {
    fields.forEach(field => {
      const rawValue = get(result, field)
      let values

      if (rawValue) {
        if (isString(rawValue) && rawValue.length > 0) {
          values = [{ id: rawValue, name: rawValue }]
        } else if (isArray(rawValue) && rawValue.length > 0) {
          values = rawValue
        } else {
          values = [rawValue]
        }

        values.forEach((value) => {
          if (facets[field][value.id]) {
            facets[field][value.id].count += 1
          } else {
            facets[field][value.id] = {
              name: value.name,
              count: 1,
            }
          }
        })
      }
    })
  })

  return facets
}

function transformFacetToOptions (facet) {
  const options = []
  forEach(facet, function (value, key) {
    options.push({
      value: key,
      label: value.name,
      count: value.count,
    })
  })

  return sortBy(options, 'label')
}

function facetSearch ({ token, searchTerm = '', searchEntity, requestBody, isAggregation = true, limit = 10, page = 1 }) {
  const searchUrl = `${config.apiRoot}/v3/search`
  let options = {
    url: isAggregation ? searchUrl : `${searchUrl}/${searchEntity}`,
    method: isAggregation ? 'GET' : 'POST',
  }
  requestBody = assign({}, requestBody, {
    original_query: searchTerm,
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

module.exports = facets
