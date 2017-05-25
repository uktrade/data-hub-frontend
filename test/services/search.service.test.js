const nock = require('nock')
const config = require(`${root}/src/config`)
const searchService = require(`${root}/src/services/search.service`)
const companyMockAPIResponse = require(`${root}/test/data/search-response-company`)
const companiesHousePrivateLtdMockAPIResponse = require(`${root}/test/data/search-response-companies-house-private-ltd`)
const companiesHousePublicLtdMockAPIResponse = require(`${root}/test/data/search-response-companies-house-public-ltd`)

function buildFacets (companyChecked, companyContactChecked) {
  return {
    'facets': {
      'Category': [
        {
          'name': 'doc_type',
          'value': 'company',
          'label': 'Company',
          'checked': companyChecked
        },
        {
          'name': 'doc_type',
          'value': 'company_contact',
          'label': 'Contact',
          'checked': companyContactChecked
        }
      ]
    }
  }
}

describe('Search service', function () {
  describe('searchService.search method', function () {
    it('Should return expected format from search method for a company', function () {
      const expectedResponse = Object.assign(companyMockAPIResponse, buildFacets(true, false))

      nock(config.apiRoot)
        .post('/search/')
        .reply(200, companyMockAPIResponse)

      searchService.search({
        token: 'token',
        term: 'testTerm',
        filters: ['company_company', 'company_companieshousecompany']
      })
        .then((response) => {
          expect(response).to.deep.equal(expectedResponse)
        })
    })

    it('Should return expected format from search method for a companies house private ltd', function () {
      const expectedResponse = Object.assign(companiesHousePrivateLtdMockAPIResponse, buildFacets(true, false))

      nock(config.apiRoot)
        .post('/search/')
        .reply(200, companiesHousePrivateLtdMockAPIResponse)

      searchService.search({
        token: 'token',
        term: 'testTerm',
        filters: ['company_company', 'company_companieshousecompany']
      })
        .then((response) => {
          expect(response).to.deep.equal(expectedResponse)
        })
    })

    it('Should return expected format from search method for a companies house public ltd', function () {
      const expectedResponse = Object.assign(companiesHousePublicLtdMockAPIResponse, buildFacets(true, false))

      nock(config.apiRoot)
        .post('/search/')
        .reply(200, companiesHousePublicLtdMockAPIResponse)

      searchService.search({
        token: 'token',
        term: 'testTerm',
        filters: ['company_company', 'company_companieshousecompany']
      })
        .then((response) => {
          expect(response).to.deep.equal(expectedResponse)
        })
    })

    it('Should return expected format from search method for a company contact', function () {
      const expectedResponse = Object.assign(companiesHousePublicLtdMockAPIResponse, buildFacets(false, true))

      nock(config.apiRoot)
        .post('/search/')
        .reply(200, companiesHousePublicLtdMockAPIResponse)

      searchService.search({
        token: 'token',
        term: 'testTerm',
        filters: ['company_contact']
      })
        .then((response) => {
          expect(response).to.deep.equal(expectedResponse)
        })
    })
  })
})
