const interactionsListData = require('~/test/unit/data/investment/interaction/interactions.json')
const { transformInteractionToListItem } = require('~/src/apps/interactions/transformers')

describe('Investment Interactions controller', () => {
  beforeEach(() => {
    this.sandbox = sinon.sandbox.create()

    this.transformedInteractions = {}

    this.getInteractionsForInvestmentStub = this.sandbox.stub().resolves(interactionsListData)
    this.transformApiResponseToCollectionStub = this.sandbox.stub().returns(this.transformedInteractions)

    this.controller = proxyquire('~/src/apps/investment-projects/controllers/interactions', {
      '../../interactions/repos': {
        getInteractionsForInvestment: this.getInteractionsForInvestmentStub,
      },
      '../../transformers': {
        transformApiResponseToCollection: this.transformApiResponseToCollectionStub,
      },
    })

    this.reqMock = {
      session: {
        token: 'abcd',
      },
      query: { },
      params: {
        id: 'example-id-1234',
      },
    }

    this.resMock = {
      breadcrumb: this.sandbox.stub().returnsThis(),
      locals: {},
      render: this.sandbox.spy(),
    }

    this.nextSpy = this.sandbox.spy()
  })

  afterEach(() => {
    this.sandbox.restore()
  })

  describe('#renderInteractionList', () => {
    context('when there are interactions to render', () => {
      beforeEach(async () => {
        await this.controller.renderInteractionList(this.reqMock, this.resMock, this.nextSpy)
      })

      it('should get interactions from the repository', () => {
        expect(this.getInteractionsForInvestmentStub).to.be.calledWith('abcd', 'example-id-1234', '1')
      })

      it('should call the transformer to convert interactions for display', () => {
        expect(this.transformApiResponseToCollectionStub).to.be.calledWith({ entityType: 'interaction' }, transformInteractionToListItem)
      })

      it('should render the interactions template', () => {
        expect(this.resMock.render).to.be.calledWith('investment-projects/views/interactions')
      })

      it('should return interactions', () => {
        const renderOptions = this.resMock.render.firstCall.args[1]
        expect(renderOptions).to.have.property('interactions')
      })
    })

    context('when the user pass pagination parameters', () => {
      beforeEach(async () => {
        this.reqMock.query.page = '2'
        await this.controller.renderInteractionList(this.reqMock, this.resMock, this.nextSpy)
      })

      it('should pass on the page parameter to the API call', () => {
        expect(this.getInteractionsForInvestmentStub).to.be.calledWith('abcd', 'example-id-1234', '2')
      })
    })

    context('when there is an error getting interactions', () => {
      beforeEach(async () => {
        this.error = {
          statusCode: 404,
        }

        this.getInteractionsForInvestmentStub.rejects(this.error)
        await this.controller.renderInteractionList(this.reqMock, this.resMock, this.nextSpy)
      })

      it('should pass the error on', () => {
        expect(this.nextSpy).to.be.calledWith(this.error)
      })
    })
  })
})
