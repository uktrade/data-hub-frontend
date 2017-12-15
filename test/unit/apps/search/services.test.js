const { assign } = require('lodash')

const config = require('~/config')
const { search } = require('~/src/apps/search/services')

describe('Search service', () => {
  describe('#search', () => {
    const searchTerm = 'testTerm'
    const searchEntity = 'company'
    const mockResponse = { message: 'mock response' }

    beforeEach(() => {
      this.nockScope = nock(config.apiRoot)
        .get(`/v3/search`)
        .query({
          term: searchTerm,
          entity: searchEntity,
          limit: 10,
          offset: 0,
        })
        .reply(200, mockResponse)
    })

    it('the result should contain correct details', async () => {
      const expectedResponse = assign({}, mockResponse, {
        page: 1,
      })

      const actual = await search({
        token: 'token',
        searchTerm,
        searchEntity,
      })

      expect(actual).to.deep.equal(expectedResponse)
      expect(this.nockScope.isDone()).to.be.true
    })
  })
})
