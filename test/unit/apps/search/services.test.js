const nock = require('nock')
const config = require('~/config')
const { search } = require('~/src/apps/search/services')

describe('Search service', function () {
  describe('searchService.search method', function () {
    it('the result should contain correct details', function () {
      const searchTerm = 'testTerm'
      const searchEntity = 'company'
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
          entity: searchEntity,
          limit: 10,
          offset: 0,
        })
        .reply(200, mockResponse)

      search({
        token: 'token',
        searchTerm,
        searchEntity,
      })
        .then((response) => {
          expect(response).to.deep.equal(expectedResponse)
        })
    })
  })
})
