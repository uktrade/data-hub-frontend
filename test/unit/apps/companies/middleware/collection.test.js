const { pickBy } = require('lodash')

const config = require('~/config')
const companiesHouseSearchResults = require('~/test/unit/data/companies/companies-house-search.json')
const ghqCompanySearchResponse = require('~/test/unit/data/companies/ghq-company-search-response.json')
const ghqCompanyTransformedResults = require('~/test/unit/data/companies/ghq-company-transformed-results.json')
const {
  getRequestBody,
  getCompanyCollection,
  getGlobalHQCompaniesCollection,
} = require('~/src/apps/companies/middleware/collection')

describe('Company collection middleware', () => {
  beforeEach(() => {
    this.mockCompanyResults = {
      count: 3,
      results: [
        { id: '111', name: 'A' },
        { id: '222', name: 'B' },
        { id: '333', name: 'C' },
      ],
    }
    this.nextSpy = sinon.spy()
    this.reqMock = {
      ...globalReq,
      session: { token: 'abcd' },
    }
    this.resMock = {
      locals: {},
    }
  })

  describe('#getCompanyCollection', () => {
    beforeEach(async () => {
      nock(config.apiRoot)
        .post(`/v3/search/company`)
        .reply(200, this.mockCompanyResults)

      this.reqMock.query = {
        stage: 'i1',
        sector: 's1',
        sortby: 'name:asc',
      }
      await getCompanyCollection(this.reqMock, this.resMock, this.nextSpy)
    })

    it('should set results property on locals with pagination', () => {
      const actual = this.resMock.locals.results
      expect(actual).to.have.property('count')
      expect(actual).to.have.property('items').to.have.length(3)
      expect(actual).to.have.property('pagination')
      expect(actual.count).to.equal(3)
      expect(this.nextSpy).to.have.been.calledOnce
    })
  })

  describe('#getRequestBody', () => {
    it('should not set req.body for empty query', () => {
      getRequestBody(this.reqMock, this.resMock, this.nextSpy)

      expect(this.reqMock.body).to.be.an('object').and.empty
      expect(this.nextSpy).to.have.been.calledOnce
    })

    it('should set req.body for valid query items', () => {
      this.reqMock.query = {
        sector_descends: 'space',
        uk_region: 'london',
        sortby: 'name:asc',
        random: 'query',
      }

      getRequestBody(this.reqMock, this.resMock, this.nextSpy)

      expect(this.reqMock.body).to.deep.equal({
        sector_descends: 'space',
        uk_region: 'london',
        sortby: 'name:asc',
      })
      expect(this.nextSpy).to.have.been.calledOnce
    })

    it('should not set req.body invalid items', async () => {
      this.reqMock.query = {
        random: 'query',
        some: 'more',
      }

      getRequestBody(this.reqMock, this.resMock, this.nextSpy)

      expect(this.reqMock.body).to.be.an('object').and.empty
      expect(this.nextSpy).to.have.been.calledOnce
    })
  })

  describe('#getLimitedCompaniesCollection', () => {
    context('when search returns results', () => {
      beforeEach(async () => {
        this.searchStub = sinon.stub().resolves(companiesHouseSearchResults)
        this.transformerStub = sinon.stub().returns({
          id: '1234',
          name: 'Freds',
          meta: [],
        })

        const collectionMiddleware = proxyquire('~/src/apps/companies/middleware/collection', {
          '../../search/services': {
            searchLimitedCompanies: this.searchStub,
          },
          '../transformers': {
            transformCompaniesHouseToListItem: this.transformerStub,
          },
        })

        this.reqMock = Object.assign({}, this.reqMock, {
          query: {
            term: 'fred',
            page: '2',
          },
        })

        await collectionMiddleware.getLimitedCompaniesCollection(this.reqMock, this.resMock, this.nextSpy)
      })

      it('should search for companies house results', () => {
        expect(this.searchStub).to.be.calledWith({
          token: 'abcd',
          searchTerm: 'fred',
          page: '2',
        })
      })

      it('should use the companies house transformer', () => {
        expect(this.transformerStub).to.be.called
      })

      it('should include results', () => {
        expect(this.resMock.locals).to.have.property('results')
      })

      it('should adjust the url in the search results to point to the add company screen', () => {
        expect(this.resMock.locals.results.items[0].url).to.equal('/companies/add/1234')
      })
    })
  })

  describe('#getGlobalHQCompaniesCollection', () => {
    beforeEach(async () => {
      this.resMock.locals.company = { id: 'mock-parent-company-id' }
    })

    context('no searchTerm', () => {
      beforeEach(async () => {
        this.reqMock.query = {}
        await getGlobalHQCompaniesCollection(this.reqMock, this.resMock, this.nextSpy)
      })

      it('should call next', () => {
        expect(this.nextSpy.calledOnce).to.be.true
      })

      it('results should be undefined', () => {
        expect(this.resMock.locals.results).to.be.undefined
      })
    })

    context('with searchTerm', () => {
      context('with 200 response', () => {
        beforeEach(async () => {
          this.reqMock.query.term = 'mock-search-term'

          nock(config.apiRoot)
            .post('/v3/search/company?limit=10&offset=0')
            .reply(200, ghqCompanySearchResponse)

          await getGlobalHQCompaniesCollection(this.reqMock, this.resMock, this.nextSpy)
        })

        it('results should be as expected', () => {
          expect(pickBy(this.resMock.locals.results)).to.deep.equal(ghqCompanyTransformedResults)
        })

        it('should call next', () => {
          expect(this.nextSpy.calledOnce).to.be.true
        })
      })

      context('with error response', () => {
        beforeEach(async () => {
          this.reqMock.query.term = 'mock-search-term'
          this.errorMsg = 'oh no!'

          nock(config.apiRoot)
            .post('/v3/search/company?limit=10&offset=0')
            .replyWithError(this.errorMsg)

          await getGlobalHQCompaniesCollection(this.reqMock, this.resMock, this.nextSpy)
        })

        it('should call next', () => {
          expect(this.nextSpy.calledOnce).to.be.true
        })

        it('should have expected error message', () => {
          expect(this.nextSpy.args[0][0].message).to.have.string(`Error: ${this.errorMsg}`)
        })

        it('results should be undefined', () => {
          expect(this.resMock.locals.results).to.be.undefined
        })
      })
    })
  })
})
