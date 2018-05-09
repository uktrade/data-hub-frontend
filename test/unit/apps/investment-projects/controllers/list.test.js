const investmentsListData = require('~/test/unit/data/investment/investment-data.json')
const { transformInvestmentProjectToListItem } = require('~/src/apps/investment-projects/transformers')

describe('Investment list controller', () => {
  beforeEach(() => {
    this.transformedInvestmentProjects = {}
    this.next = sinon.spy()
    this.req = {
      session: {
        token: 'abcd',
      },
      query: {},
    }
    this.res = {
      render: sinon.spy(),
      query: {},
    }

    this.getInvestmentsStub = sinon.stub().resolves(investmentsListData)
    this.transformApiResponseToCollectionStub = sinon.stub().returns(this.transformedInvestmentProjects)

    this.buildSelectedFiltersSummaryStub = sinon.spy()

    this.controller = proxyquire('~/src/apps/investment-projects/controllers/list', {
      '../../builders': {
        buildSelectedFiltersSummary: this.buildSelectedFiltersSummaryStub,
      },
    })

    this.next = sinon.spy()
  })

  describe('#renderInvestmentList', () => {
    context('when there are investments to render', () => {
      beforeEach(async () => {
        await this.controller.renderInvestmentList(this.req, this.res, this.next)
      })

      it('should render collection page with locals', () => {
        this.controller.renderInvestmentList(this.req, this.res, this.next)

        it('should get interactions from the repository', () => {
          expect(this.getInvestmentsStub).to.be.calledWith('abcd')
        })

        it('should call the transformer to convert investment project for display', () => {
          expect(this.transformApiResponseToCollectionStub).to.be.calledWith({ entityType: 'interaction' }, transformInvestmentProjectToListItem)
        })

        it('should return investment projects', () => {
          const renderOptions = this.res.render.firstCall.args[1]
          expect(renderOptions).to.have.property('investment-projects')
        })
      })
    })
  })
})
