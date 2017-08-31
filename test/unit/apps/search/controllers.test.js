const nock = require('nock')
const config = require('~/config')
const { renderSearchResults } = require('~/src/apps/search/controllers')

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
