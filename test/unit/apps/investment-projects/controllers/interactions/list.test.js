const investmentData = require('~/test/unit/data/investment/investment-data.json')
const interactionsListData = require('~/test/unit/data/investment/interaction/interactions.json')
const interactionCompanyDisplayFormated = require('~/test/unit/data/investment/interaction/interaction-formatted.json')

describe('Investment Interactions Index controller', () => {
  beforeEach(() => {
    this.sandbox = sinon.sandbox.create()
    this.next = this.sandbox.stub()
    this.breadcrumbStub = function () { return this }
    this.getInteractionsForInvestmentStub = this.sandbox.stub().resolves(interactionsListData)
    this.controller = proxyquire('~/src/apps/investment-projects/controllers/interactions/list', {
      '../../../interactions/repos': {
        getInteractionsForInvestment: this.getInteractionsForInvestmentStub,
      },
    })
  })

  afterEach(() => {
    this.sandbox.restore()
  })

  describe('#indexGetHandler', () => {
    it('should return interactions with currentNavItem set to interactions', (done) => {
      this.controller.indexGetHandler({
        session: {
          token: 'abcd',
        },
        params: {
          id: 'example-id-1234',
        },
      }, {
        locals: {
          investmentData,
        },
        breadcrumb: this.breadcrumbStub,
        render: (template, data) => {
          try {
            expect(template).to.equal('investment-projects/views/interactions/index')
            expect(data.currentNavItem).to.equal('interactions')
            expect(data.interactions).to.deep.equal(interactionCompanyDisplayFormated)
            done()
          } catch (error) {
            done(error)
          }
        },
      }, this.next)
    })
  })
})
