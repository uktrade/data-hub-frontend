const { pickBy } = require('lodash')

const config = require('../../../../config')
const ghqCompanySearchResponse = require('../../../../../test/unit/data/companies/ghq-company-search-response.json')
const ghqCompanyTransformedResults = require('../../../../../test/unit/data/companies/ghq-company-transformed-results.json')
const subsidiaryCompanySearchResponse = require('../../../../../test/unit/data/companies/subsidiary-company-search-response.json')
const subsidiaryCompanyTransformedResults = require('../../../../../test/unit/data/companies/subsidiary-company-transformed-results.json')

const {
  getGlobalHQCompaniesCollection,
  getSubsidiaryCompaniesCollection,
} = require('../collection')

const headquarterTypes = [
  {
    id: '3e6debb4-1596-40c5-aa25-f00da0e05af9',
    name: 'ukhq',
    disabled_on: null,
  },
  {
    id: 'eb59eaeb-eeb8-4f54-9506-a5e08773046b',
    name: 'ehq',
    disabled_on: null,
  },
  {
    id: '43281c5e-92a4-4794-867b-b4d5f801e6f3',
    name: 'ghq',
    disabled_on: null,
  },
]
// TODO: add new functional test to companies testing the views for HQ companies and subsidiaries (using the contexts outlined below). This could be in addition to: test/functional/cypress/specs/companies/dnb-hierarchy-spec.js (ensuring non D&B companies are covered if there is a business need)
describe('Company collection middleware', () => {
  beforeEach(() => {
    this.nextSpy = sinon.spy()
    this.reqMock = {
      ...globalReq,
      session: { token: 'abcd' },
    }
    this.resMock = {
      locals: {},
    }
  })

  describe('#getGlobalHQCompaniesCollection', () => {
    beforeEach(async () => {
      this.resMock.locals.company = { id: 'mock-global-headquarters-id' }
    })

    context('no searchTerm', () => {
      beforeEach(async () => {
        this.reqMock.query = {}
        await getGlobalHQCompaniesCollection(
          this.reqMock,
          this.resMock,
          this.nextSpy
        )
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
            .get('/v4/metadata/headquarter-type')
            .reply(200, headquarterTypes)
            .post('/v4/search/company?offset=0&limit=10')
            .reply(200, ghqCompanySearchResponse)

          await getGlobalHQCompaniesCollection(
            this.reqMock,
            this.resMock,
            this.nextSpy
          )
        })

        it('results should be as expected', () => {
          expect(pickBy(this.resMock.locals.results)).to.deep.equal(
            ghqCompanyTransformedResults
          )
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
            .get('/v4/metadata/headquarter-type')
            .reply(200, headquarterTypes)
            .post('/v4/search/company?offset=0&limit=10')
            .replyWithError(this.errorMsg)

          await getGlobalHQCompaniesCollection(
            this.reqMock,
            this.resMock,
            this.nextSpy
          )
        })

        it('should call next', () => {
          expect(this.nextSpy.calledOnce).to.be.true
        })

        it('should have expected error message', () => {
          expect(this.nextSpy.args[0][0].message).to.have.string(
            `Error: ${this.errorMsg}`
          )
        })

        it('results should be undefined', () => {
          expect(this.resMock.locals.results).to.be.undefined
        })
      })
    })
  })

  describe('#getSubsidiaryCompaniesCollection', () => {
    beforeEach(async () => {
      this.resMock.locals.company = { id: 'mock-global-headquarters-id' }
    })

    context('no searchTerm', () => {
      beforeEach(async () => {
        this.reqMock.query = {}
        await getSubsidiaryCompaniesCollection(
          this.reqMock,
          this.resMock,
          this.nextSpy
        )
      })

      it('should call next', () => {
        expect(this.nextSpy.calledOnce).to.be.true
        expect(this.nextSpy).to.be.calledWithExactly()
      })

      it('results should be undefined', () => {
        expect(this.resMock.locals.results).to.be.undefined
      })
    })

    context('with searchTerm', () => {
      beforeEach(() => {
        this.reqMock.query.term = 'mock-search-term'
      })

      context('a couple of results', () => {
        beforeEach(async () => {
          nock(config.apiRoot)
            .get('/v4/metadata/headquarter-type')
            .reply(200, headquarterTypes)
            .post('/v4/search/company?offset=0&limit=10', {
              headquarter_type: [
                'eb59eaeb-eeb8-4f54-9506-a5e08773046b',
                '3e6debb4-1596-40c5-aa25-f00da0e05af9',
                null,
              ],
              original_query: 'mock-search-term',
              isAggregation: false,
            })
            .reply(200, subsidiaryCompanySearchResponse)

          await getSubsidiaryCompaniesCollection(
            this.reqMock,
            this.resMock,
            this.nextSpy
          )
        })

        it('should return results', () => {
          expect(this.resMock.locals).to.have.property('results')
        })

        it('should include a count of results', () => {
          const results = this.resMock.locals.results
          expect(results).to.have.property('count', 2)
        })

        it('should not include any pagination information', () => {
          const results = this.resMock.locals.results
          expect(results).to.have.property('pagination', null)
        })

        it('should include transformed result items', () => {
          const results = this.resMock.locals.results
          expect(results).to.have.property('items')
          expect(results.items).to.deep.equal(
            subsidiaryCompanyTransformedResults.items
          )
        })

        it('should call next', () => {
          expect(this.nextSpy).to.be.calledOnce
          expect(this.nextSpy).to.be.calledWithExactly()
        })
      })

      context('more than 10 results', () => {
        beforeEach(async () => {
          nock(config.apiRoot)
            .get('/v4/metadata/headquarter-type')
            .reply(200, headquarterTypes)
            .post('/v4/search/company?offset=0&limit=10', {
              headquarter_type: [
                'eb59eaeb-eeb8-4f54-9506-a5e08773046b',
                '3e6debb4-1596-40c5-aa25-f00da0e05af9',
                null,
              ],
              original_query: 'mock-search-term',
              isAggregation: false,
            })
            .reply(200, {
              ...subsidiaryCompanySearchResponse,
              count: 50,
            })

          await getSubsidiaryCompaniesCollection(
            this.reqMock,
            this.resMock,
            this.nextSpy
          )
        })

        it('should include pagination information', () => {
          const results = this.resMock.locals.results
          expect(results).to.have.property('pagination')
          expect(results.pagination).to.have.property('currentPage', 1)
          expect(results.pagination).to.have.property('prev')
          expect(results.pagination).to.have.property('next')
          expect(results.pagination.pages).to.have.length(5)
        })
      })

      context('with error response', () => {
        beforeEach(async () => {
          this.errorMsg = 'oh no!'

          nock(config.apiRoot)
            .get('/v4/metadata/headquarter-type')
            .reply(200, headquarterTypes)
            .post('/v4/search/company?offset=0&limit=10', {
              headquarter_type: [
                'eb59eaeb-eeb8-4f54-9506-a5e08773046b',
                '3e6debb4-1596-40c5-aa25-f00da0e05af9',
                null,
              ],
              original_query: 'mock-search-term',
              isAggregation: false,
            })
            .reply(500, this.errorMsg)

          await getSubsidiaryCompaniesCollection(
            this.reqMock,
            this.resMock,
            this.nextSpy
          )
        })

        it('should call next', () => {
          expect(this.nextSpy.calledOnce).to.be.true
        })

        it('should have expected error message', () => {
          expect(this.nextSpy.firstCall.args[0].message).to.have.string(
            `500 - "${this.errorMsg}"`
          )
        })

        it('results should be undefined', () => {
          expect(this.resMock.locals.results).to.be.undefined
        })
      })
    })
  })
})
