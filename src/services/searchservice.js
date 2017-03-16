const authorisedRequest = require('../lib/authorisedrequest')
const config = require('../config')
const includes = require('lodash/includes')
const Q = require('q')

const winston = require('winston')

const FACETS = {
  'Category': [
    { name: 'doc_type', value: 'company', label: 'Company' },
    { name: 'doc_type', value: 'company_contact', label: 'Contact' }
  ]
}

function search ({ token, term, limit = 10, page = 1, filters }) {
  let body = { term, limit }
  body.offset = (page * body.limit) - body.limit

  if (filters) {
    body = Object.assign(body, filters)
  }

  // Filters for company actually means filtering for 2 company types
  // so we modify the criteria sent to the server.
  if (body.doc_type && body.doc_type === 'company') {
    body.doc_type = ['company_company', 'company_companieshousecompany']
  } else if (body.doc_type && Array.isArray(body.doc_type) && includes(body.doc_type, 'company')) {
    let newDocTypeArray = body.doc_type.filter(item => item !== 'company')
    newDocTypeArray.push('company_company')
    newDocTypeArray.push('company_companieshousecompany')
    body.doc_type = newDocTypeArray
  }

  const options = {
    url: `${config.apiRoot}/search/`,
    body,
    method: 'POST'
  }

  return authorisedRequest(token, options)
    .then(result => {
      populateFacets(result, filters)
      result.term = term
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

function hasFilterForFacet (filters, facet) {
  const name = facet.name
  const value = facet.value

  return ((filters[name] && filters[name] === value) ||
      (filters[name] && Array.isArray(filters[name]) && includes(filters[name], value)))
}

function populateFacets (result, filters) {
  let facets = Object.assign({}, FACETS)

  // Go through each facet, and then it's options.
  // See if the facet option appears in the filters, if so then mark the option checked.
  const facetTitles = Object.keys(facets)
  for (const facetTitle of facetTitles) {
    for (let facet of facets[facetTitle]) {
      facet.checked = hasFilterForFacet(filters, facet)
    }
  }

  result.facets = facets
}

function searchLimited (token, term) {
  return new Promise((resolve, reject) => {
    Q.spawn(function * () {
      try {
        const allResults = yield search({token, term, page: 1, filters: ['company_company', 'company_companieshousecompany']})
        const filtered = allResults.hits.filter(result => result._source.company_number)
        resolve(filtered)
      } catch (error) {
        winston.error(error)
        reject(error)
      }
    })
  })
}

module.exports = { search, suggestCompany, searchLimited }
