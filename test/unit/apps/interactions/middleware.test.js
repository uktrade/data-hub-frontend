const interactionSearchResults = {}

describe('Interactions middleware', () => {
  beforeEach(() => {
    this.sandbox = sinon.sandbox.create()
    this.transformApiResponseToSearchCollectionStub = this.sandbox.stub()

    this.searchStub = this.sandbox.stub().resolves({
      count: 1,
      results: [interactionSearchResults],
    })

    this.transformedInteractionStub = { id: '1234' }
    this.transformInteractionToListItemStub = this.sandbox.stub().returns(this.transformedInteractionStub)

    this.middleware = proxyquire('~/src/apps/interactions/middleware', {
      '../search/services': {
        search: this.searchStub,
      },
      './transformers': {
        transformInteractionToListItem: this.transformInteractionToListItemStub,
      },
    })

    this.req = {
      body: {},
      session: {
        token: '1234',
      },
      query: {
        page: '1',
      },
    }

    this.res = {
      locals: {},
    }

    this.next = this.sandbox.spy()
  })

  afterEach(() => {
    this.sandbox.restore()
  })

  describe('#getRequestBody', () => {
    it('should set the sort order if provided', () => {
      this.req.query.sortby = 'subject'
      this.middleware.getRequestBody(this.req, this.res, this.next)
      this.req.body.selectedSortBy = 'subject'
    })
  })
})
