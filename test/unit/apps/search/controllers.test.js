const nock = require('nock')
const config = require('~/config')

const next = function (error) {
  throw Error(error)
}

describe('Search controller #viewCompanyResult', function () {
  beforeEach(() => {
    this.breadcrumbStub = function () { return this }
  })

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
      breadcrumb: this.breadcrumbStub,
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
      breadcrumb: this.breadcrumbStub,
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
      breadcrumb: this.breadcrumbStub,
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
      breadcrumb: this.breadcrumbStub,
      redirect: function (url) {
        expect(url).to.equal('/companies/view/foreign/9999')
        done()
      },
    }
    searchController.viewCompanyResult(req, res, next)
  })

  it('should call next if no company is found', function (done) {
    const searchController = proxyquire('~/src/apps/search/controllers', {
      '../companies/repos': {
        getDitCompany: sinon.stub().resolves(undefined),
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
      breadcrumb: this.breadcrumbStub,
    }
    const nextStub = (error) => {
      try {
        expect(() => {
          throw error
        }).to.throw()
        done()
      } catch (e) {
        done(e)
      }
    }
    searchController.viewCompanyResult(req, res, nextStub)
  })
})

describe('Search Controller #searchAction', () => {
  const companyResponse = require('~/test/unit/data/search/company')
  const searchQuery = {
    term: 'mock',
    entity: 'company',
    limit: 10,
    offset: 0,
  }

  nock(config.apiRoot).get(`/v3/search`)
    .query(Object.assign({}, searchQuery, { entity: 'company' }))
    .reply(200, companyResponse)

  function expectedSearchEntityResultsData (companyCount = 3, contactCount = 1, investmentCount = 5) {
    return [
      {
        count: companyCount,
        entity: 'company',
        path: 'companies',
        text: 'Companies',
        noun: 'company',
      },
      {
        count: contactCount,
        entity: 'contact',
        path: 'contacts',
        text: 'Contacts',
        noun: 'contact',
      },
      {
        count: investmentCount,
        entity: 'investment_project',
        path: 'investment-projects',
        text: 'Investment projects',
        noun: 'investment project',
      },
    ]
  }

  beforeEach(() => {
    this.sandbox = sinon.sandbox.create()
    this.next = this.sandbox.spy()
    this.controller = require('~/src/apps/search/controllers')
    this.breadcrumbStub = function () { return this }
  })

  afterEach(() => {
    this.sandbox.restore()
  })

  it('should render results page for company', (done) => {
    const token = '1234'
    const entityType = 'company'
    const searchPath = 'companies'
    const expectedResults = Object.assign({}, companyResponse, {
      page: 1,
      pagination: null,
    })

    this.controller.searchAction(
      {
        session: {
          token,
        },
        query: {
          term: searchQuery.term,
        },
        params: {
          searchPath,
        },
      },
      {
        breadcrumb: this.breadcrumbStub,
        render: (template, data) => {
          try {
            expect(template).to.equal(`search/views/results-${entityType}`)
            expect(data.searchTerm).to.equal(searchQuery.term)
            expect(data.searchEntity).to.equal(entityType)
            expect(data.results).to.have.property('companies').to.deep.equal(expectedResults.companies)
            expect(data.results).to.have.property('aggregations').to.deep.equal(expectedSearchEntityResultsData(0))
            done()
          } catch (e) {
            done(e)
          }
        },
      }, this.next
    )
  })
})

describe('Search Controller #renderSearchResults', () => {
  const investmentResponse = require('~/test/unit/data/search/investment')
  const contactResponse = require('~/test/unit/data/search/contact')

  const searchQuery = {
    term: 'london',
    limit: 10,
    offset: 0,
  }

  nock(config.apiRoot).get(`/v3/search`)
    .query(Object.assign({}, searchQuery, { entity: 'investment_project' }))
    .reply(200, investmentResponse)

  nock(config.apiRoot).get(`/v3/search`)
    .query(Object.assign({}, searchQuery, { entity: 'contact' }))
    .reply(200, contactResponse)

  beforeEach(async () => {
    this.controller = require('~/src/apps/search/controllers')
    this.sandbox = sinon.sandbox.create()
    this.next = this.sandbox.spy()
    this.renderFunction = this.sandbox.spy()
    this.breadcrumbStub = function () { return this }

    this.req = {
      session: { token: 'abcd' },
      query: {
        term: searchQuery.term,
      },
      params: {},
    }

    this.res = {
      breadcrumb: this.breadcrumbStub,
      render: this.renderFunction,
    }
  })

  it('should redirect to index for invalid paths', async () => {
    this.req.params.searchPath = 'dummy-path'

    await this.controller.renderSearchResults(this.req, this.res, this.next)

    expect(this.renderFunction).to.be.calledWith('search/views/index')
  })

  it('should call render with investment projects data', async () => {
    this.req.params.searchPath = 'investment-projects'
    await this.controller.renderSearchResults(this.req, this.res, this.next)

    expect(this.renderFunction).to.be.calledWith(
      sinon.match.any,
      sinon.match({
        searchEntity: 'investment_project',
        searchTerm: 'london',
        results: sinon.match.object,
      })
    )
  })

  it('should call render with contacts data', async () => {
    this.req.params.searchPath = 'contacts'
    await this.controller.renderSearchResults(this.req, this.res, this.next)

    expect(this.renderFunction).to.be.calledWith(
      sinon.match.any,
      sinon.match({
        searchEntity: 'contact',
        searchTerm: 'london',
        results: sinon.match.object,
      })
    )
  })
})
