describe('#getInteractionCollection', () => {
  beforeEach(async () => {
    this.sandbox = sinon.sandbox.create()
    this.transformApiResponseToSearchCollectionStub = this.sandbox.stub()

    this.searchStub = this.sandbox.stub().resolves({
      count: 1,
      results: [{ id: '1' }],
    })

    this.transformedInteractionStub = { id: '1234' }
    this.transformInteractionToListItemStub = this.sandbox.stub().returns(this.transformedInteractionStub)

    this.middleware = proxyquire('~/src/apps/interactions/middleware/collection', {
      '../../search/services': {
        search: this.searchStub,
      },
      '../transformers': {
        transformInteractionToListItem: this.transformInteractionToListItemStub,
      },
    })

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
      locals: {},
    }

    this.next = this.sandbox.spy()
  })

  context('when called with default values', () => {
    beforeEach(async () => {
      await this.middleware.getInteractionCollection(this.req, this.res, this.next)
    })

    it('should call the search api to get interactions', () => {
      expect(this.searchStub).to.be.calledWith({
        searchEntity: 'interaction',
        requestBody: this.req.body,
        token: this.req.session.token,
        page: this.req.query.page,
        isAggregation: false,
      })
    })

    it('should create a collection of interactions', () => {
      expect(this.res.locals.interactions.count).to.equal(1)
      expect(this.res.locals.interactions.items).to.contain(this.transformedInteractionStub)
    })

    it('sould create a sort form', () => {
      expect(this.res.locals).to.have.property('sortForm')
    })
  })

  context('when called with contact id', () => {
    beforeEach(async () => {
      this.req.params.contactId = '1234'
      await this.middleware.getInteractionCollection(this.req, this.res, this.next)
    })

    it('should call search with a filter for contact id', () => {
      expect(this.searchStub).to.be.calledWith({
        searchEntity: 'interaction',
        requestBody: { contact: '1234' },
        token: this.req.session.token,
        page: this.req.query.page,
        isAggregation: false,
      })
    })
  })

  context('when called with sort order', () => {
    beforeEach(async () => {
      this.req.query.sortby = 'subject'
      await this.middleware.getInteractionCollection(this.req, this.res, this.next)
    })

    it('should set the sort order in the search query', () => {
      expect(this.searchStub).to.be.calledWith({
        searchEntity: 'interaction',
        requestBody: { sortby: 'subject' },
        token: this.req.session.token,
        page: this.req.query.page,
        isAggregation: false,
      })
    })
  })
})
