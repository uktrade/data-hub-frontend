const interactionData = require('~/test/unit/data/investment/interaction/interaction.json')
const interactionTransformedFromApiData = require('~/test/unit/data/investment/interaction/interaction-transformed-from-api.json')
const errorMsg = 'mock error'

describe('Investment shared middleware', () => {
  beforeEach(() => {
    this.sandbox = sinon.sandbox.create()
    this.getInteractionStub = this.sandbox.stub().resolves(interactionData)
    this.nextSpy = this.sandbox.spy()
    this.resMock = { locals: {} }

    this.controller = proxyquire('~/src/controllers/investment/shared.middleware', {
      '../../repos/interaction.repo': {
        getInteraction: this.getInteractionStub,
      },
    })
  })

  afterEach(() => {
    this.sandbox.restore()
  })

  describe('#getLocalNavMiddleware', () => {
    it('should return local nav items', () => {
      this.controller.getLocalNavMiddleware({}, this.resMock, this.nextSpy)

      expect(this.resMock.locals).to.haveOwnProperty('localNavItems')
      expect(this.nextSpy.calledOnce).to.be.true
    })
  })

  describe('#getInteractionDetails', () => {
    it('should add interaction to res.locals', (done) => {
      this.controller.getInteractionDetails({
        session: {
          token: 'mock-token',
        },
        params: {
          interactionId: interactionData.id,
        },
      }, this.resMock, () => {
        expect(this.resMock.locals.interaction).to.deep.equal(
          Object.assign({}, interactionData, interactionTransformedFromApiData)
        )
        done()
      })
    })
    it('should add interaction to res.locals', (done) => {
      this.controller.getInteractionDetails({
        session: {
          token: 'mock-token',
        },
        params: {
          interactionId: interactionData.id,
        },
      }, this.resMock, () => {
        expect(this.resMock.locals.interaction).to.deep.equal(
          Object.assign({}, interactionData, interactionTransformedFromApiData)
        )
        done()
      })
    })
  })
})

describe('Investment shared middleware - error testing', () => {
  beforeEach(() => {
    this.sandbox = sinon.sandbox.create()
    this.getInteractionStub = this.sandbox.stub().rejects(errorMsg)
    this.nextSpy = this.sandbox.spy()
    this.resMock = { locals: {} }

    this.controller = proxyquire('~/src/controllers/investment/shared.middleware', {
      '../../repos/interaction.repo': {
        getInteraction: this.getInteractionStub,
      },
    })
  })

  afterEach(() => {
    this.sandbox.restore()
  })

  describe('#getInteractionDetails', () => {
    it('should call next with errors', (done) => {
      this.controller.getInteractionDetails({
        session: {
          token: 'mock-token',
        },
        params: {
          interactionId: interactionData.id,
        },
      }, this.resMock, (error) => {
        expect(error.name).to.equal(errorMsg)
        done()
      })
    })
  })
})
