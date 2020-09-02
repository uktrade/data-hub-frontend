const config = require('../../../config')
const {
  search,
  searchCompanies,
  searchInvestments,
  searchForeignCompanies,
  exportSearch,
  searchAutocomplete,
  searchDnbCompanies,
} = require('../services')
const buildMiddlewareParameters = require('../../../../test/unit/helpers/middleware-parameters-builder')

const stubRequest = { session: { token: '1234' } }

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
          req: stubRequest,
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
          .get(
            `/v3/search?field=true&limit=10&term=search&offset=0&entity=company`
          )
          .reply(200, {
            count: 0,
            results: [],
            aggregations: [],
          })

        this.actual = await search({
          req: stubRequest,
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
          .post(`/v4/search/company`, {
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
          req: stubRequest,
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
        .post(`/v4/search/company?offset=0&limit=10`, {
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
        req: stubRequest,
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
        req: stubRequest,
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
        .post(`/v4/search/company?offset=0&limit=10`, {
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
        req: stubRequest,
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

  describe('#exportSearch', () => {
    context('when exporting company records', () => {
      beforeEach(async () => {
        nock(config.apiRoot)
          .post(`/v4/search/company/export`, {
            field: true,
            term: 'search',
          })
          .reply(200, {
            count: 0,
            results: [],
            aggregations: [],
          })

        this.middlewareParameters = buildMiddlewareParameters({
          resMock: {
            on: sinon.spy(),
            emit: sinon.spy(),
            end: sinon.spy(),
            removeListener: sinon.spy(),
          },
        })

        await exportSearch({
          req: stubRequest,
          searchTerm: 'search',
          searchEntity: 'company',
          requestBody: {
            field: true,
          },
        }).then((response) => {
          response.pipe(this.middlewareParameters.resMock)
        })
      })

      it('should return the response', () => {
        expect(this.middlewareParameters.resMock.on).to.be.called
      })
    })

    context('when exporting records that are not company', () => {
      beforeEach(async () => {
        nock(config.apiRoot)
          .post(`/v3/search/entity/export`, {
            field: true,
            term: 'search',
          })
          .reply(200, {
            count: 0,
            results: [],
            aggregations: [],
          })

        this.middlewareParameters = buildMiddlewareParameters({
          resMock: {
            on: sinon.spy(),
            emit: sinon.spy(),
            end: sinon.spy(),
            removeListener: sinon.spy(),
          },
        })

        await exportSearch({
          req: stubRequest,
          searchTerm: 'search',
          searchEntity: 'entity',
          requestBody: {
            field: true,
          },
        }).then((response) => {
          response.pipe(this.middlewareParameters.resMock)
        })
      })

      it('should return the response', () => {
        expect(this.middlewareParameters.resMock.on).to.be.called
      })
    })
  })

  describe('#searchAutocomplete', () => {
    beforeEach(async () => {
      nock(config.apiRoot)
        .get(`/v4/search/company/autocomplete?term=search`)
        .reply(200, {
          count: 0,
          results: [],
        })

      this.actual = await searchAutocomplete({
        req: stubRequest,
        searchEntity: 'company',
        searchTerm: 'search',
      })
    })

    it('should return the response', () => {
      expect(this.actual).to.deep.equal({
        count: 0,
        results: [],
      })
    })
  })

  describe('#searchDnbCompanies', () => {
    beforeEach(async () => {
      nock(config.apiRoot)
        .post(`/v4/dnb/company-search`, {
          search_term: 'company',
          address_country: 'GB',
          page_size: 100,
        })
        .reply(200, {
          count: 0,
          results: [],
        })

      this.actual = await searchDnbCompanies({
        req: stubRequest,
        requestBody: {
          search_term: 'company',
          address_country: 'GB',
        },
      })
    })

    it('should return the response', () => {
      expect(this.actual).to.deep.equal({
        count: 0,
        results: [],
      })
    })
  })
})
