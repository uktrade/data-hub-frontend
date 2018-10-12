const MAX_EXPORT_ITEMS = require('~/src/lib/filter-constants.js').INVESTMENT_PROJECTS.SECTOR.MAX_EXPORT_ITEMS

describe('Investment list controller', () => {
  beforeEach(() => {
    this.error = new Error('error')
    this.next = sinon.spy()
    this.req = {
      session: {
        user: {
          id: '1234',
          name: 'Fred Smith',
          permissions: [],
        },
        token: 'abcd',
      },
      query: {
        sortby: 'estimated_land_date:asc',
      },
    }
    this.res = {
      render: sinon.spy(),
      query: {},
    }

    this.buildSelectedFiltersSummaryStub = sinon.spy()

    const controller = proxyquire('~/src/apps/investment-projects/controllers/list', {
      '../../builders': {
        buildSelectedFiltersSummary: this.buildSelectedFiltersSummaryStub,
        buildFieldsWithSelectedEntities: sinon.stub(),
      },
      '../../../lib/options': {
        getOptions: sinon.stub(),
      },
    })

    this.renderInvestmentList = controller.renderInvestmentList
    this.next = sinon.spy()
  })

  describe('#renderInvestmentList', () => {
    context('when the list renders successfully', () => {
      const commonTests = () => {
        it('should not catch an error', () => {
          expect(this.next).to.not.have.been.called
        })

        it('should render the view', () => {
          expect(this.res.render).to.have.been.calledOnce
        })
      }

      context('when the user is allowed to export projects', () => {
        beforeEach(async () => {
          this.req.session.user.permissions = ['investment.export_investmentproject']
          await this.renderInvestmentList(this.req, this.res, this.next)
          this.exportAction = this.res.render.firstCall.args[1].exportAction
        })

        it('should enable the export button', () => {
          expect(this.exportAction.enabled).to.equal(true)
        })

        it('should return a function to build the export status message', () => {
          expect(this.exportAction.buildMessage).to.be.a('function')
        })

        it('should return a function that can check if items have been filtered enough to export', () => {
          expect(this.exportAction.tooManyItems).to.be.a('function')
        })

        it('should return a url to download the csv', () => {
          expect(this.exportAction.url).to.equal('investment-projects/export?sortby=estimated_land_date%3Aasc')
        })

        it('should output a message if further filtering is required', () => {
          expect(this.exportAction.buildMessage(MAX_EXPORT_ITEMS + 1)).to.equal(`Filter to less than ${MAX_EXPORT_ITEMS} projects to download`)
        })

        commonTests()
      })

      context('when the user is not allowed to export projects', () => {
        beforeEach(async () => {
          this.req.session.user.permissions = []
          await this.renderInvestmentList(this.req, this.res, this.next)
        })

        it('should not enable the export button', () => {
          const exportAction = this.res.render.firstCall.args[1].exportAction
          expect(exportAction).to.deep.equal({ enabled: false })
        })

        commonTests()
      })
    })
  })
})
