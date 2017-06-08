const nock = require('nock')
const config = require('~/src/config')
const { search } = require('~/src/services/search.service')

describe('Search service', function () {
  describe('searchService.search method', function () {
    it('the result should contain correct details', function () {
      const searchTerm = 'testTerm'
      const searchType = 'company'
      const mockResponse = {
        message: 'expected response',
      }
      const expectedResponse = {
        message: 'expected response',
        page: 1,
      }

      nock(config.apiRoot)
        .get(`/v3/search`)
        .query({
          term: searchTerm,
          entity: searchType,
          limit: 10,
          offset: 0,
        })
        .reply(200, mockResponse)

      search({
        token: 'token',
        searchTerm,
        searchType,
      })
        .then((response) => {
          expect(response).to.deep.equal(expectedResponse)
        })
    })
  })
})
