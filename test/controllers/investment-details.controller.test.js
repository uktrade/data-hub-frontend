const investmentProjectSummaryData = require('../data/investment/project-summary.json')
const investmentValueData = require('../data/investment/project-value.json')
const investmentRequirements = require('../data/investment/project-requirements.json')

const token = 'abcd'

describe('Investment details controller', () => {
  beforeEach(() => {
    this.sandbox = sinon.sandbox.create()
    this.next = this.sandbox.stub()
    this.getInvestmentProjectSummary = this.sandbox.stub().resolves(investmentProjectSummaryData)
    this.getInvestmentValue = this.sandbox.stub().resolves(investmentValueData)
    this.getInvestmentRequirements = this.sandbox.stub().resolves(investmentRequirements)

    this.controller = proxyquire(`${root}/src/controllers/investment-details.controller`, {
      '../repos/investment.repo': {
        getInvestmentProjectSummary: this.getInvestmentProjectSummary,
        getInvestmentValue: this.getInvestmentValue,
        getInvestmentRequirements: this.getInvestmentRequirements
      }
    })
  })

  afterEach(() => {
    this.sandbox.restore()
  })

  describe('#getDetails', () => {
    it('should return investment summary for investmentId', () => {
      this.controller.getDetails({
        session: {
          token
        },
        params: {
          id: investmentProjectSummaryData.id
        }
      }, {
        render: (template, data) => {
          expect(this.getInvestmentProjectSummary).to.be.calledWith(token, investmentProjectSummaryData.id)
          expect(data.project).to.deep.equal(investmentProjectSummaryData)
        }
      }, this.next)
    })
  })
})
