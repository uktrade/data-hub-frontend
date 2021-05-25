const proxyquire = require('proxyquire')

const investmentData = require('../../../../../test/unit/data/investment/investment-data.json')

describe('Investment details controller', () => {
  beforeEach(() => {
    this.next = sinon.stub()
    this.transformInvestmentRequirementsForViewStub = sinon.stub()

    this.controller = proxyquire('../details', {
      '../transformers': {
        transformInvestmentRequirementsForView:
          this.transformInvestmentRequirementsForViewStub,
        transformInvestmentForView: sinon.stub(),
        transformInvestmentValueForView: sinon.stub(),
      },
    })
  })

  describe('#detailsGetHandler', () => {
    it('should return investment details', (done) => {
      this.controller.detailsGetHandler(
        {
          session: {
            token: 'abcd',
          },
        },
        {
          locals: {
            investment: investmentData,
          },
          render: (template) => {
            try {
              expect(template).to.equal('investments/views/details')
              done()
            } catch (error) {
              done(error)
            }
          },
        },
        this.next
      )
    })

    context('when there are no requirements', () => {
      beforeEach(() => {
        this.transformInvestmentRequirementsForViewStub.returns({
          one: 'two',
          uk_company: null,
          strategic_drivers: null,
        })

        this.req = {
          session: {
            token: 'abcd',
          },
        }

        this.res = {
          locals: {
            investment: investmentData,
          },
          render: sinon.stub(),
        }

        this.controller.detailsGetHandler(this.req, this.res, this.next)
        this.renderOptions = this.res.render.firstCall.args[1]
      })

      it('show the add requirements message', () => {
        expect(this.renderOptions.isRequirementsStarted).to.eq(false)
      })

      it('strip out null values', () => {
        expect(this.renderOptions.requirements).to.deep.equal({})
      })
    })

    context('when there is just a uk company requirement property', () => {
      beforeEach(() => {
        this.transformInvestmentRequirementsForViewStub.returns({
          one: 'two',
          uk_company: 'test company',
          strategic_drivers: null,
        })

        this.req = {
          session: {
            token: 'abcd',
          },
        }

        this.res = {
          locals: {
            investment: investmentData,
          },
          render: sinon.stub(),
        }

        this.controller.detailsGetHandler(this.req, this.res, this.next)
        this.renderOptions = this.res.render.firstCall.args[1]
      })

      it('show the add requirements message', () => {
        expect(this.renderOptions.isRequirementsStarted).to.eq(false)
      })

      it('strip out null values', () => {
        expect(this.renderOptions.requirements).to.deep.equal({
          'UK recipient company': 'test company',
        })
      })
    })

    context('when requirements is fully populated', () => {
      beforeEach(() => {
        this.transformInvestmentRequirementsForViewStub.returns({
          strategic_drivers: 'Some drivers',
          uk_company: 'test company',
          client_requirements: null,
        })

        this.req = {
          session: {
            token: 'abcd',
          },
        }

        this.res = {
          locals: {
            investment: investmentData,
          },
          render: sinon.stub(),
        }

        this.controller.detailsGetHandler(this.req, this.res, this.next)
        this.renderOptions = this.res.render.firstCall.args[1]
      })

      it('show the edit requirements message', () => {
        expect(this.renderOptions.isRequirementsStarted).to.eq(true)
      })

      it('strip out null values', () => {
        expect(this.renderOptions.requirements).to.deep.equal({
          'UK recipient company': 'test company',
          'Strategic drivers': 'Some drivers',
        })
      })
    })
  })
})
