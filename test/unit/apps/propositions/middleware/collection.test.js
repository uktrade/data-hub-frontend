const { assign } = require('lodash')
describe('proposition collection middleware', () => {
  beforeEach(async () => {
    this.req = {
      body: {},
      session: {
        token: '1234',
      },
      params: {},
      query: {
        page: '1',
      },
    }

    this.res = {
      locals: {
        returnLink: '/return',
      },
    }

    this.next = sinon.spy()
  })

  describe('#getPropositionCollection', () => {
    beforeEach(async () => {
      this.transformApiResponseToSearchCollectionStub = sinon.stub()

      this.searchStub = sinon.stub().resolves({
        count: 1,
        results: [{ id: '1' }],
      })

      this.transformedPropositionStub = { id: '1234' }
      this.transformedPropositionWithUrlPrefixStub = assign({}, this.transformedPropositionStub, { urlPrefix: 'return' })
      this.transformPropositionToListItemStub = sinon.stub().returns(this.transformedPropositionStub)
      this.transformPropositionListItemToHaveUrlPrefixStub =
        sinon.stub().returns(() => { return this.transformedPropositionWithUrlPrefixStub })

      this.middleware = proxyquire('~/src/apps/propositions/middleware/collection', {
        '../../search/services': {
          search: this.searchStub,
        },
        '../transformers': {
          transformPropositionToListItem: this.transformPropositionToListItemStub,
          transformPropositionListItemToHaveUrlPrefix: this.transformPropositionListItemToHaveUrlPrefixStub,
        },
      })

      await this.middleware.getPropositionCollection(this.req, this.res, this.next)
    })

    it('should call the search api to get propositions', () => {
      expect(this.searchStub).to.be.calledWith({
        searchEntity: 'proposition',
        requestBody: this.req.body,
        token: this.req.session.token,
        page: this.req.query.page,
        isAggregation: false,
      })
    })

    it('should create a collection of propositions', () => {
      expect(this.res.locals.results.count).to.equal(1)
      expect(this.res.locals.results.items[0]).to.deep.equal(this.transformedPropositionWithUrlPrefixStub)
    })
  })
})
