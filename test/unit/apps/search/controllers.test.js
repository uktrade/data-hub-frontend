const nock = require('nock')
const config = require('~/config')
const { searchAction, renderSearchResults } = require('~/src/apps/search/controllers')

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

  function expectedSearchEntityResultsData (companyCount = 3, contactCount = 1, investmentCount = 5, orderCount = 4) {
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
      {
        count: orderCount,
        entity: 'order',
        path: 'omis',
        text: 'Orders',
        noun: 'order',
      },
    ]
  }

  beforeEach(() => {
    this.sandbox = sinon.sandbox.create()
    this.next = this.sandbox.spy()
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

    searchAction(
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
            expect(data.results).to.have.property('items').to.deep.equal(expectedResults.companies)
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

    await renderSearchResults(this.req, this.res, this.next)

    expect(this.renderFunction).to.be.calledWith('search/views/index')
  })

  it('should call render with investment projects data', async () => {
    this.req.params.searchPath = 'investment-projects'
    await renderSearchResults(this.req, this.res, this.next)

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
    await renderSearchResults(this.req, this.res, this.next)

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
