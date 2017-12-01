const config = require('~/config')
const { getRequestBody, getCompanyCollection } = require('~/src/apps/companies/middleware/collection')
const companiesHouseSearchResults = require('~/test/unit/data/companies/companies-house-search.json')

describe('Company collection middleware', () => {
  beforeEach(() => {
    this.sandbox = sinon.sandbox.create()
    this.mockCompanyResults = {
      count: 3,
      results: [
        { id: '111', name: 'A' },
        { id: '222', name: 'B' },
        { id: '333', name: 'C' },
      ],
    }
    this.next = this.sandbox.spy()
    this.req = Object.assign({}, globalReq, {
      session: { token: 'abcd' },
    })
    this.res = {
      locals: {},
    }
  })

  afterEach(() => {
    this.sandbox.restore()
  })

  describe('#getCompanyCollection', () => {
    beforeEach(async () => {
      this.nockScope = nock(config.apiRoot)
        .post(`/v3/search/company`)
        .reply(200, this.mockCompanyResults)

      this.req.query = {
        stage: 'i1',
        sector: 's1',
        sortby: 'name:asc',
      }
      await getCompanyCollection(this.req, this.res, this.next)
    })

    it('should set results property on locals with pagination', () => {
      const actual = this.res.locals.results
      expect(actual).to.have.property('count')
      expect(actual).to.have.property('items').to.have.length(3)
      expect(actual).to.have.property('pagination')
      expect(actual.count).to.equal(3)
      expect(this.next).to.have.been.calledOnce
    })

    it('nock mocked scope has been called', () => {
      expect(this.nockScope.isDone()).to.be.true
    })
  })

  describe('#getRequestBody', () => {
    it('should not set req.body for empty query', () => {
      getRequestBody(this.req, this.res, this.next)

      expect(this.req.body).to.be.an('object').and.empty
      expect(this.next).to.have.been.calledOnce
    })

    it('should set req.body for valid query items', () => {
      this.req.query = {
        sector: 'space',
        uk_region: 'london',
        sortby: 'name:asc',
        random: 'query',
      }

      getRequestBody(this.req, this.res, this.next)

      expect(this.req.body).to.deep.equal({
        sector: 'space',
        uk_region: 'london',
        sortby: 'name:asc',
      })
      expect(this.next).to.have.been.calledOnce
    })

    it('should not set req.body invalid items', async () => {
      this.req.query = {
        random: 'query',
        some: 'more',
      }

      getRequestBody(this.req, this.res, this.next)

      expect(this.req.body).to.be.an('object').and.empty
      expect(this.next).to.have.been.calledOnce
    })
  })

  describe('#getLimitedCompaniesCollection', () => {
    context('when search returns results', () => {
      beforeEach(async () => {
        this.searchStub = this.sandbox.stub().resolves(companiesHouseSearchResults)
        this.transformerStub = this.sandbox.stub().returns({
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

        this.req = Object.assign({}, this.req, {
          query: {
            term: 'fred',
            page: '2',
          },
        })

        await collectionMiddleware.getLimitedCompaniesCollection(this.req, this.res, this.next)
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
        expect(this.res.locals).to.have.property('results')
      })

      it('should adjust the url in the search results to point to the add company screen', () => {
        expect(this.res.locals.results.items[0].url).to.equal('/companies/add/1234')
      })
    })
  })
})
