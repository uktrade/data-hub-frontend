const { assign } = require('lodash')
describe('interaction collection middleware', () => {
  beforeEach(async () => {
    this.sandbox = sinon.sandbox.create()

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

    this.next = this.sandbox.spy()
  })

  afterEach(() => {
    this.sandbox.reset()
  })

  describe('#getInteractionCollection', () => {
    beforeEach(async () => {
      this.transformApiResponseToSearchCollectionStub = this.sandbox.stub()

      this.searchStub = this.sandbox.stub().resolves({
        count: 1,
        results: [{ id: '1' }],
      })

      this.transformedInteractionStub = { id: '1234' }
      this.transformedInteractionWithUrlPrefixStub = assign({}, this.transformedInteractionStub, { urlPrefix: 'return' })
      this.transformInteractionToListItemStub = this.sandbox.stub().returns(this.transformedInteractionStub)
      this.transformInteractionListItemToHaveUrlPrefixStub =
        this.sandbox.stub().returns(() => { return this.transformedInteractionWithUrlPrefixStub })

      this.middleware = proxyquire('~/src/apps/interactions/middleware/collection', {
        '../../search/services': {
          search: this.searchStub,
        },
        '../transformers': {
          transformInteractionToListItem: this.transformInteractionToListItemStub,
          transformInteractionListItemToHaveUrlPrefix: this.transformInteractionListItemToHaveUrlPrefixStub,
        },
      })

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
      expect(this.res.locals.interactions.items[0]).to.deep.equal(this.transformedInteractionWithUrlPrefixStub)
    })
  })

  describe('#getInteractionsRequestBody', () => {
    beforeEach(() => {
      this.middleware = require('~/src/apps/interactions/middleware/collection')
    })

    context('when called with contact id', () => {
      beforeEach(() => {
        this.req.params.contactId = '1234'
        this.middleware.getInteractionsRequestBody(this.req, this.res, this.next)
      })

      it('should set the contact in the request body', () => {
        expect(this.req.body.contact).to.equal('1234')
      })
    })

    context('when called with company id', () => {
      beforeEach(() => {
        this.req.params.companyId = '1234'
        this.middleware.getInteractionsRequestBody(this.req, this.res, this.next)
      })

      it('should set the contact in the request body', () => {
        expect(this.req.body.company).to.equal('1234')
      })
    })

    context('when called with sort order', () => {
      beforeEach(() => {
        this.req.query.sortby = 'name'
        this.middleware.getInteractionsRequestBody(this.req, this.res, this.next)
      })

      it('should set the sort order in the request body', () => {
        expect(this.req.body.sortby).to.equal('name')
      })
    })

    context('when called with filter criteria', () => {
      beforeEach(() => {
        this.req.query = assign({}, this.req.query, {
          kind: 'interaction',
          communication_channel: 'phone',
          dit_adviser: '4321',
          date_after: '2017-02-01',
          date_before: '2018-01-01',
          fruit: 'Orange',
        })

        this.middleware.getInteractionsRequestBody(this.req, this.res, this.next)
      })

      it('should put the criteria in the request body', () => {
        expect(this.req.body.kind).to.equal(this.req.query.kind)
        expect(this.req.body.communication_channel).to.equal(this.req.query.communication_channel)
        expect(this.req.body.dit_adviser).to.equal(this.req.query.dit_adviser)
        expect(this.req.body.date_after).to.equal(this.req.query.date_after)
        expect(this.req.body.date_before).to.equal(this.req.query.date_before)
      })

      it('should not include invalid parameters', () => {
        expect(this.req.body).to.not.have.property('fruit')
      })
    })
  })

  describe('#getInteractionSortForm', () => {
    beforeEach(() => {
      this.middleware = require('~/src/apps/interactions/middleware/collection')
    })

    context('when called with no sort order', () => {
      beforeEach(() => {
        this.middleware.getInteractionSortForm(this.req, this.res, this.next)
      })

      it('should generate a sort form', () => {
        expect(this.res.locals).to.have.property('sortForm')
      })
    })

    context('when called with a sort order', () => {
      beforeEach(() => {
        this.req.query.sortby = 'name'
        this.middleware.getInteractionSortForm(this.req, this.res, this.next)
      })

      it('should generate a sort form', () => {
        expect(this.res.locals).to.have.property('sortForm')
      })

      it('should indicate the selected sort order', () => {
        expect(this.res.locals.sortForm.children[0].value).to.equal('name')
      })
    })
  })
})
