const interaction = require('~/test/unit/data/interactions/search-interaction.json')

describe('Company interactions middleware', async () => {
  beforeEach(() => {
    this.sandbox = sinon.sandbox.create()

    this.result = {
      count: 1,
      results: [ interaction ],
    }

    this.getInteractionsForCompanyStub = this.sandbox.stub().resolves(this.result)

    this.transformedInteractionStub = { id: '1234' }
    this.transformInteractionToListItemStub = this.sandbox.stub().returns(this.transformedInteractionStub)

    this.middleware = proxyquire('~/src/apps/companies/middleware/interactions', {
      '../../interactions/repos': {
        getInteractionsForCompany: this.getInteractionsForCompanyStub,
      },
      '../../interactions/transformers': {
        transformInteractionToListItem: this.transformInteractionToListItemStub,
      },
    })

    this.req = {
      params: {
        companyId: '1234',
      },
      query: {},
      session: {
        token: '9999',
      },
    }

    this.res = {
      locals: {},
    }

    this.next = this.sandbox.stub()
  })

  it('Should get interactions associated with the company', async () => {
    await this.middleware.getInteractionCollection(this.req, this.res, this.next)
    expect(this.getInteractionsForCompanyStub).to.be.calledWith('9999', '1234', '1')
  })

  it('should pass on any page number specified, for pagination', async () => {
    this.req.query.page = '2'
    await this.middleware.getInteractionCollection(this.req, this.res, this.next)
    expect(this.getInteractionsForCompanyStub).to.be.calledWith('9999', '1234', '2')
  })

  it('should create a collection for display', async () => {
    await this.middleware.getInteractionCollection(this.req, this.res, this.next)
    expect(this.res.locals.interactions.count).to.equal(1)
    expect(this.res.locals.interactions.items).to.contain(this.transformedInteractionStub)
  })
})
