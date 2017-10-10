const { assign } = require('lodash')
const interactionData = require('~/test/unit/data/interactions/search-interaction.json')

describe('Interaction details controller', () => {
  beforeEach(() => {
    this.sandbox = sinon.sandbox.create()

    this.req = {
      params: {
        id: '1234',
      },
      session: {
        token: '4321',
      },
    }

    this.res = {
      breadcrumb: this.sandbox.stub().returnsThis(),
      render: this.sandbox.spy(),
      locals: {
        interaction: interactionData,
      },
    }

    this.next = this.sandbox.spy()

    this.transformedInteractionDataMock = {}

    this.transformInteractionResponseToViewRecordStub = this.sandbox.stub().returns(this.transformedInteractionDataMock)

    this.controller = proxyquire('~/src/apps/interactions/controllers/details', {
      '../transformers': {
        transformInteractionResponseToViewRecord: this.transformInteractionResponseToViewRecordStub,
      },
    })
  })

  describe('#renderDetailsPage', () => {
    beforeEach(() => {
      this.controller.renderDetailsPage(this.req, this.res, this.next)
    })

    it('should use the interaction details transformer', () => {
      expect(this.transformInteractionResponseToViewRecordStub).to.be.calledWith(this.res.locals.interaction)
    })

    it('should render the interaction details template', () => {
      expect(this.res.render).to.be.calledWith('interactions/views/details')
    })

    it('should include interaction data', () => {
      const renderOptions = this.res.render.firstCall.args[1]
      expect(renderOptions.interactionViewRecord).to.deep.equal(this.transformedInteractionDataMock)
    })

    context('When the user views an interaction', () => {
      beforeEach(() => {
        this.res.locals.interaction = assign({}, interactionData, { kind: 'interaction' })
        this.controller.renderDetailsPage(this.req, this.res, this.next)
      })

      it('should set the breadcrumb to interaction', () => {
        expect(this.res.breadcrumb).to.be.calledWith('Interaction')
      })
    })

    context('When the user views a service delivery', () => {
      beforeEach(() => {
        this.res.locals.interaction = assign(interactionData, { kind: 'service_delivery' })
        this.controller.renderDetailsPage(this.reqS, this.res, this.next)
      })

      it('should set the breadcrumb to Service delivery', () => {
        expect(this.res.breadcrumb).to.be.calledWith('Service delivery')
      })
    })
  })
})
