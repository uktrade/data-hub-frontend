const nock = require('nock')
const config = require('~/config')

const next = function (error) {
  throw Error(error)
}

describe('Search controller', function () {
  describe('view company result', function () {
    it('should route a uk private ltd company', function (done) {
      const searchController = proxyquire('~/src/apps/search/controllers', {
        '../companies/repos': {
          getDitCompany: sinon.stub().resolves({
            id: '9999',
            uk_based: true,
            business_type: {
              id: '9bd14e94-5d95-e211-a939-e4115bead28a',
              name: 'Private limited company',
            },
          }),
        },
      })
      const req = {
        session: {
          token: '1234',
        },
        params: {
          id: '9999',
        },
      }
      const res = {
        locals: {},
        redirect: function (url) {
          expect(url).to.equal('/companies/view/ltd/9999')
          done()
        },
      }
      searchController.viewCompanyResult(req, res, next)
    })
    it('should route a uk public ltd company', function (done) {
      const searchController = proxyquire('~/src/apps/search/controllers', {
        '../companies/repos': {
          getDitCompany: sinon.stub().resolves({
            id: '9999',
            uk_based: true,
            business_type: {
              id: '9bd14e94-5d95-e211-a939-e4115bead28a',
              name: 'Public limited company',
            },
          }),
        },
      })
      const req = {
        session: {
          token: '1234',
        },
        params: {
          id: '9999',
        },
      }
      const res = {
        locals: {},
        redirect: function (url) {
          expect(url).to.equal('/companies/view/ltd/9999')
          done()
        },
      }
      searchController.viewCompanyResult(req, res, next)
    })
    it('should route a uk public other company', function (done) {
      const searchController = proxyquire('~/src/apps/search/controllers', {
        '../companies/repos': {
          getDitCompany: sinon.stub().resolves({
            id: '9999',
            uk_based: true,
            business_type: {
              id: '9bd14e94-5d95-e211-a939-e4115bead28a',
              name: 'Partnership',
            },
          }),
        },
      })
      const req = {
        session: {
          token: '1234',
        },
        params: {
          id: '9999',
        },
      }
      const res = {
        locals: {},
        redirect: function (url) {
          expect(url).to.equal('/companies/view/ukother/9999')
          done()
        },
      }
      searchController.viewCompanyResult(req, res, next)
    })
    it('should route a foreign company', function (done) {
      const searchController = proxyquire('~/src/apps/search/controllers', {
        '../companies/repos': {
          getDitCompany: sinon.stub().resolves({
            id: '9999',
            uk_based: false,
            business_type: {
              id: '9bd14e94-5d95-e211-a939-e4115bead28a',
              name: 'Company',
            },
          }),
        },
      })
      const req = {
        session: {
          token: '1234',
        },
        params: {
          id: '9999',
        },
      }
      const res = {
        locals: {},
        redirect: function (url) {
          expect(url).to.equal('/companies/view/foreign/9999')
          done()
        },
      }
      searchController.viewCompanyResult(req, res, next)
    })
  })
})

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
            breadcrumbs: sinon.stub(),
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
            breadcrumbs: sinon.stub(),
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
