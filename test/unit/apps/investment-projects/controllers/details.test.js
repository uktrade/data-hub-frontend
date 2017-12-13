const investmentData = require('~/test/unit/data/investment/investment-data.json')

describe('Investment details controller', () => {
  beforeEach(() => {
    this.next = sandbox.stub()
    this.transformInvestmentRequirementsForViewStub = sandbox.stub()

    this.controller = proxyquire('~/src/apps/investment-projects/controllers/details', {
      '../services/formatting': {
        transformInvestmentRequirementsForView: this.transformInvestmentRequirementsForViewStub,
        transformInvestmentDataForView: sandbox.stub(),
        transformInvestmentValueForView: sandbox.stub(),
      },
    })
  })

  afterEach(() => {
    this.sandbox.restore()
  })

  describe('#detailsGetHandler', () => {
    it('should return investment details', (done) => {
      this.controller.detailsGetHandler({
        session: {
          token: 'abcd',
        },
      }, {
        locals: {
          investmentData,
        },
        render: (template, data) => {
          try {
            expect(template).to.equal('investment-projects/views/details')
            done()
          } catch (error) {
            done(error)
          }
        },
      }, this.next)
    })

    context('when there are no requirements', () => {
      beforeEach(() => {
        this.transformInvestmentRequirementsForViewStub.returns({
          'one': 'two',
          'uk_company': null,
          'strategic_drivers': null,
        })

        this.req = {
          session: {
            token: 'abcd',
          },
        }

        this.res = {
          locals: {
            investmentData,
          },
          render: sandbox.stub(),
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
          'one': 'two',
          'uk_company': 'test company',
          'strategic_drivers': null,
        })

        this.req = {
          session: {
            token: 'abcd',
          },
        }

        this.res = {
          locals: {
            investmentData,
          },
          render: sandbox.stub(),
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
          'strategic_drivers': 'Some drivers',
          'uk_company': 'test company',
          'client_requirements': null,
        })

        this.req = {
          session: {
            token: 'abcd',
          },
        }

        this.res = {
          locals: {
            investmentData,
          },
          render: sandbox.stub(),
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
