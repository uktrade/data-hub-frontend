const nock = require('nock')
const config = require('~/config')
const { renderSearchResults } = require('~/src/apps/search/controllers')

describe('Search Controller #renderSearchResults', () => {
  const investmentResponse = require('~/test/unit/data/search/investment')
  const contactResponse = require('~/test/unit/data/search/contact')
  const companyResponse = require('~/test/unit/data/search/company')
  const eventResponse = require('~/test/unit/data/search/event')

  const searchQuery = {
    term: 'london',
    limit: 10,
    offset: 0,
  }

  beforeEach(async () => {
    nock(config.apiRoot).get(`/v3/search`)
      .query(Object.assign({}, searchQuery, { entity: 'investment_project' }))
      .reply(200, investmentResponse)

    nock(config.apiRoot).get(`/v3/search`)
      .query(Object.assign({}, searchQuery, { entity: 'contact' }))
      .reply(200, contactResponse)

    nock(config.apiRoot).get(`/v3/search`)
      .query(Object.assign({}, searchQuery, { entity: 'company' }))
      .reply(200, companyResponse)

    nock(config.apiRoot).get(`/v3/search`)
      .query(Object.assign({}, searchQuery, { entity: 'event' }))
      .reply(200, eventResponse)

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

  context('for invalid paths', () => {
    it('should redirect to index', async () => {
      this.req.params.searchPath = 'dummy-path'

      await renderSearchResults(this.req, this.res, this.next)

      expect(this.renderFunction).to.be.calledWith('search/view')
    })
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

  it('should transform investment projects data', async () => {
    this.req.params.searchPath = 'investment-projects'
    await renderSearchResults(this.req, this.res, this.next)

    const actualItems = this.renderFunction.getCall(0).args[1].results.items

    expect(actualItems[0].type).to.equal('investment-project')
  })

  it('should call render with contacts data', async () => {
    this.req.params.searchPath = 'contacts'
    await renderSearchResults(this.req, this.res, this.next)

    expect(this.renderFunction).to.be.calledWith(
      'search/view',
      sinon.match({
        searchEntity: 'contact',
        searchTerm: 'london',
        results: sinon.match.object,
      })
    )
  })

  it('should transform contacts data', async () => {
    this.req.params.searchPath = 'contacts'
    await renderSearchResults(this.req, this.res, this.next)

    const actualItems = this.renderFunction.getCall(0).args[1].results.items

    expect(actualItems[0].type).to.equal('contact')
  })

  it('should call render with companies data', async () => {
    this.req.params.searchPath = 'companies'
    await renderSearchResults(this.req, this.res, this.next)

    expect(this.renderFunction).to.be.calledWith(
      'search/view',
      sinon.match({
        searchEntity: 'company',
        searchTerm: 'london',
        results: sinon.match.object,
      })
    )
  })

  it('should transform companies data', async () => {
    this.req.params.searchPath = 'companies'
    await renderSearchResults(this.req, this.res, this.next)

    const actualItems = this.renderFunction.getCall(0).args[1].results.items

    expect(actualItems[0].type).to.equal('company')
  })

  it('should call render with events data', async () => {
    this.req.params.searchPath = 'events'
    await renderSearchResults(this.req, this.res, this.next)

    expect(this.renderFunction).to.be.calledWith(
      'search/view',
      sinon.match({
        searchEntity: 'event',
        searchTerm: 'london',
        results: sinon.match.object,
      })
    )
  })

  it('should transform events data', async () => {
    this.req.params.searchPath = 'events'
    await renderSearchResults(this.req, this.res, this.next)

    const actualItems = this.renderFunction.getCall(0).args[1].results.items

    expect(actualItems[0].type).to.equal('event')
  })
})
