const config = require('~/config')
const {
  search,
  searchCompanies,
  searchInvestments,
  searchForeignCompanies,
  searchLimitedCompanies,
} = require('~/src/modules/search/services')

describe('Search service', () => {
  describe('#search', () => {
    context('when minimal parameters are populated', () => {
      beforeEach(async () => {
        nock(config.apiRoot)
          .get(`/v3/search?limit=10&term=search&offset=0`)
          .reply(200, {
            count: 0,
            results: [],
            aggregations: [],
          })

        this.actual = await search({
          token: '1234',
          searchTerm: 'search',
        })
      })

      it('should return the response', () => {
        expect(this.actual).to.deep.equal({
          aggregations: [],
          count: 0,
          page: 1,
          results: [],
        })
      })
    })

    context('when all parameters are populated', () => {
      beforeEach(async () => {
        nock(config.apiRoot)
          .get(`/v3/search?field=true&limit=10&term=search&offset=0&entity=company`)
          .reply(200, {
            count: 0,
            results: [],
            aggregations: [],
          })

        this.actual = await search({
          token: '1234',
          searchTerm: 'search',
          searchEntity: 'company',
          requestBody: {
            field: true,
          },
        })
      })

      it('should return the response', () => {
        expect(this.actual).to.deep.equal({
          aggregations: [],
          count: 0,
          page: 1,
          results: [],
        })
      })
    })

    context('when default parameters are customised', () => {
      beforeEach(async () => {
        nock(config.apiRoot)
          .post(`/v3/search/company`, {
            field: true,
            term: 'search',
            limit: 100,
            offset: 100,
          })
          .reply(200, {
            count: 0,
            results: [],
            aggregations: [],
          })

        this.actual = await search({
          token: '1234',
          searchTerm: 'search',
          searchEntity: 'company',
          requestBody: {
            field: true,
          },
          isAggregation: false,
          limit: 100,
          page: 2,
        })
      })

      it('should return the response', () => {
        expect(this.actual).to.deep.equal({
          aggregations: [],
          count: 0,
          page: 2,
          results: [],
        })
      })
    })
  })

  describe('#searchCompanies', () => {
    beforeEach(async () => {
      nock(config.apiRoot)
        .post(`/v3/search/company?offset=0&limit=10`, {
          field: true,
          original_query: 'search',
          uk_based: true,
          isAggregation: false,
        })
        .reply(200, {
          count: 0,
          results: [],
          aggregations: [],
        })

      this.actual = await searchCompanies({
        token: '1234',
        searchTerm: 'search',
        isUkBased: true,
        requestBody: {
          field: true,
        },
      })
    })

    it('should return the response', () => {
      expect(this.actual).to.deep.equal({
        aggregations: [],
        count: 0,
        page: 1,
        results: [],
      })
    })
  })

  describe('#searchInvestments', () => {
    beforeEach(async () => {
      nock(config.apiRoot)
        .post(`/v3/search/investment_project?offset=0&limit=10`, {
          field: true,
          original_query: 'search',
          searchEntity: 'investment_project',
        })
        .reply(200, {
          count: 0,
          results: [],
          aggregations: [],
        })

      this.actual = await searchInvestments({
        token: '1234',
        searchTerm: 'search',
        filters: {
          field: true,
        },
      })
    })

    it('should return the response', () => {
      expect(this.actual).to.deep.equal({
        aggregations: [],
        count: 0,
        page: 1,
        results: [],
      })
    })
  })

  describe('#searchForeignCompanies', () => {
    beforeEach(async () => {
      nock(config.apiRoot)
        .post(`/v3/search/company?offset=0&limit=10`, {
          original_query: 'search',
          uk_based: false,
          isAggregation: false,
        })
        .reply(200, {
          count: 0,
          results: [],
          aggregations: [],
        })

      this.actual = await searchForeignCompanies({
        token: '1234',
        searchTerm: 'search',
      })
    })

    it('should return the response', () => {
      expect(this.actual).to.deep.equal({
        aggregations: [],
        count: 0,
        page: 1,
        results: [],
      })
    })
  })

  describe('#searchLimitedCompanies', () => {
    beforeEach(async () => {
      nock(config.apiRoot)
        .post(`/v3/search/companieshousecompany?offset=0&limit=10`, {
          original_query: 'search',
        })
        .reply(200, {
          count: 0,
          results: [],
          aggregations: [],
        })

      this.actual = await searchLimitedCompanies({
        token: '1234',
        searchTerm: 'search',
      })
    })

    it('should return the response', () => {
      expect(this.actual).to.deep.equal({
        aggregations: [],
        count: 0,
        page: 1,
        results: [],
      })
    })
  })
})
