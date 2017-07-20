const investmentData = require('~/test/unit/data/investment/investment-data.json')

describe('Investment team middleware', () => {
  beforeEach(() => {
    this.sandbox = sinon.sandbox.create()
    this.transformBriefInvestmentSummaryStub = this.sandbox.stub()
    this.nextSpy = this.sandbox.spy()
    this.reqMock = {}
    this.resMock = {
      locals: {
        investmentData,
      },
    }

    this.controller = proxyquire('~/src/apps/investment-projects/middleware/team', {
      '../services/formatting': {
        transformBriefInvestmentSummary: this.transformBriefInvestmentSummaryStub,
      },
    })
  })

  afterEach(() => {
    this.sandbox.restore()
  })

  describe('#getBriefInvestmentSummary', () => {
    it('should call brief investment summary formatter with expanded project', (done) => {
      this.controller.getBriefInvestmentSummary({
        session: {
          token: 'mock-token',
        },
      }, this.resMock, () => {
        expect(this.transformBriefInvestmentSummaryStub).to.be.calledWith(investmentData)
        done()
      })
    })
  })
})
