const { assign } = require('lodash')
const proxyquire = require('proxyquire')

const propositionData = require('../../../../../test/unit/data/propositions/proposition.json')

describe('Proposition details controller', () => {
  beforeEach(() => {
    this.req = {
      params: {
        id: '1234',
      },
      session: {
        token: '4321',
      },
    }

    this.res = {
      breadcrumb: sinon.stub().returnsThis(),
      title: sinon.stub().returnsThis(),
      render: sinon.spy(),
      locals: {
        proposition: propositionData,
      },
    }

    this.next = sinon.spy()

    this.transformedPropositionDataMock = {}

    this.transformPropositionResponseToViewRecordStub = sinon
      .stub()
      .returns(this.transformedPropositionDataMock)

    this.controller = proxyquire('../details', {
      '../transformers': {
        transformPropositionResponseToViewRecord:
          this.transformPropositionResponseToViewRecordStub,
      },
    })
  })

  describe('#renderDetailsPage', () => {
    beforeEach(() => {
      this.controller.renderDetailsPage(this.req, this.res, this.next)
    })

    it('should use the proposition details transformer', () => {
      expect(
        this.transformPropositionResponseToViewRecordStub
      ).to.be.calledWith(this.res.locals.proposition)
    })

    it('should set the title', () => {
      expect(this.res.title).to.be.calledWith('Game-changing Proposition')
    })

    it('should render the proposition details template', () => {
      expect(this.res.render).to.be.calledWith('propositions/views/details')
    })

    it('should include proposition data', () => {
      const renderOptions = this.res.render.firstCall.args[1]
      expect(renderOptions.propositionViewRecord).to.deep.equal(
        this.transformedPropositionDataMock
      )
    })

    context('When the user views an proposition', () => {
      beforeEach(() => {
        this.res.locals.proposition = assign({}, propositionData, {
          kind: 'proposition',
        })
        this.controller.renderDetailsPage(this.req, this.res, this.next)
      })

      it('should set the breadcrumb to proposition', () => {
        expect(this.res.breadcrumb).to.be.calledWith(
          'Game changing proposition'
        )
      })
    })
  })
})
