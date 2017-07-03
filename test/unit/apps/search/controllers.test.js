const nock = require('nock')
const config = require('~/config')

describe('Search Controller', () => {
  beforeEach(() => {
    this.sandbox = sinon.sandbox.create()
    this.next = this.sandbox.spy()
    this.controller = require('~/src/apps/search/controllers')
  })

  afterEach(() => {
    this.sandbox.restore()
  })

  describe('indexAction method', () => {
    describe('when query param term is not provided', () => {
      it('should render index page', (done) => {
        this.controller.indexAction(
          {
            session: {
              token: '1234',
            },
            query: {},
          },
          {
            render: (template) => {
              expect(template).to.equal('search/views/index')
              done()
            },
          }, this.next
        )
      })
    })

    describe('when query param term is provided', () => {
      it('should drop through to next middleware', () => {
        this.controller.indexAction(
          {
            session: {
              token: '1234',
            },
            query: {
              term: 'mock term',
            },
          }, {}, this.next
        )

        expect(this.next.calledOnce).to.be.true
      })
    })
  })

  describe('searchAction method', () => {
    const searchTerm = 'mock'
    const expectedSearchEntityResultsData = (companyCount = 3, contactCount = 1) => {
      return [
        {
          count: companyCount,
          entity: 'company',
          text: 'Companies',
        },
        {
          count: contactCount,
          entity: 'contact',
          text: 'Contacts',
        },
      ]
    }

    describe('when called with "company" searchType', () => {
      const companyResponse = require('~/test/unit/data/search/company')

      it('should render results page for company', (done) => {
        const token = '1234'
        const searchType = 'company'
        const expectedResults = Object.assign({}, companyResponse, {
          page: 1,
        })

        nock(config.apiRoot)
          .get(`/v3/search`)
          .query({
            term: searchTerm,
            entity: searchType,
            limit: 10,
            offset: 0,
          })
          .reply(200, companyResponse)

        this.controller.searchAction(
          {
            session: {
              token,
            },
            query: {
              term: searchTerm,
            },
            params: {
              searchType,
            },
          },
          {
            render: (template, data) => {
              try {
                expect(template).to.equal(`search/views/results-${searchType}`)
                expect(data.searchTerm).to.equal(searchTerm)
                expect(data.searchType).to.equal(searchType)
                expect(data.searchEntityResultsData).to.deep.equal(expectedSearchEntityResultsData(0))
                expect(data.results).to.deep.equal(expectedResults)
                expect(data.pagination).to.be.a('array')
                expect(data.pagination.length).to.equal(0)
                done()
              } catch (e) {
                done(e)
              }
            },
          }, this.next
        )
      })
    })

    describe('when called with "contact" searchType', () => {
      const contactResponse = require('~/test/unit/data/search/contact')

      it('should render results page for contact', (done) => {
        const searchType = 'contact'
        const expectedResults = Object.assign({}, contactResponse, {
          page: 1,
        })

        nock(config.apiRoot)
          .get(`/v3/search`)
          .query({
            term: searchTerm,
            entity: searchType,
            limit: 10,
            offset: 0,
          })
          .reply(200, contactResponse)

        this.controller.searchAction(
          {
            session: {
              token: '1234',
            },
            query: {
              term: searchTerm,
            },
            params: {
              searchType,
            },
          },
          {
            render: (template, data) => {
              try {
                expect(template).to.equal(`search/views/results-${searchType}`)
                expect(data.searchTerm).to.equal(searchTerm)
                expect(data.searchType).to.equal(searchType)
                expect(data.searchEntityResultsData).to.deep.equal(expectedSearchEntityResultsData())
                expect(data.results).to.deep.equal(expectedResults)
                expect(data.pagination).to.be.a('array')
                expect(data.pagination.length).to.equal(0)
                done()
              } catch (e) {
                done(e)
              }
            },
          }, this.next
        )
      })
    })
  })
})
