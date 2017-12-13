const { assign } = require('lodash')
const investmentData = require('~/test/unit/data/investment/investment-data.json')
const { briefInvestmentSummaryLabels } = require('~/src/apps/investment-projects/labels')

describe('Investment project, project management team, edit controller', () => {
  beforeEach(() => {
    this.nextStub = sandbox.stub()
    this.flashStub = sandbox.stub()
    this.getDataLabelsStub = sandbox.stub()
    this.breadcrumbStub = sandbox.stub().returnsThis()
    this.reqMock = assign({}, globalReq, {
      session: {
        token: '1234',
      },
      flash: this.flashStub,
    })
    this.resMock = assign({}, globalRes, {
      redirect: sandbox.spy(),
      render: sandbox.spy(),
      breadcrumb: this.breadcrumbStub,
    })

    this.controller = proxyquire('~/src/apps/investment-projects/controllers/team/edit-project-management', {
      '../../../../lib/controller-utils': {
        getDataLabels: this.getDataLabelsStub,
      },
    })
  })

  afterEach(() => {
    this.sandbox.restore()
  })

  describe('#getHandler', () => {
    it('should render edit project management view', async () => {
      await this.controller.getHandler(this.reqMock, assign({}, this.resMock, {
        locals: {
          investmentData,
        },
      }), this.nextStub)

      expect(this.resMock.render).to.have.been.calledWith('investment-projects/views/team/edit-project-management')
    })

    it('should get formatted data for summary view', async () => {
      const briefInvestmentSummaryData = { id: 1 }

      await this.controller.getHandler(this.reqMock, assign({}, this.resMock, {
        locals: {
          investmentData,
          briefInvestmentSummaryData,
        },
      }), this.nextStub)

      expect(this.getDataLabelsStub).to.be.calledWith(briefInvestmentSummaryData, briefInvestmentSummaryLabels.view)
    })
  })

  describe('#postHandler', () => {
    context('without errors', () => {
      it('should redirect to the project details page', async () => {
        await this.controller.postHandler(this.reqMock, assign({}, this.resMock, {
          locals: {
            form: {
              errors: {},
            },
            investmentData,
          },
        }), this.nextStub)

        expect(this.resMock.redirect).to.be.calledWith(`/investment-projects/${investmentData.id}/team`)
        expect(this.flashStub).to.calledWith('success', 'Investment details updated')
      })
    })

    context('without errors and returnUrl query', () => {
      it('should redirect to the returnUrl page', async () => {
        const mockReturnUrl = 'mock-url'

        await this.controller.postHandler(assign({}, this.reqMock, {
          body: {
            returnUrl: mockReturnUrl,
          },
        }),
        assign({}, this.resMock, {
          locals: {
            form: {
              errors: {},
            },
            investmentData,
          },
        }), this.nextStub)

        expect(this.flashStub).to.calledWith('success', 'Investment details updated')
        expect(this.resMock.redirect).to.be.calledWith(mockReturnUrl)
      })
    })

    context('when form errors exist', () => {
      it('should pass the error onto the edit form', () => {
        this.controller.postHandler(this.reqMock, assign({}, this.resMock, {
          locals: {
            form: {
              errors: {
                subject: 'example error',
              },
            },
          },
        }), this.nextStub)

        expect(this.nextStub).to.be.calledOnce
      })
    })
  })
})
