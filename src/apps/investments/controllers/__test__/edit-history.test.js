const proxyquire = require('proxyquire')
const buildMiddlewareParameters = require('../../../../../test/unit/helpers/middleware-parameters-builder')
const investmentData = require('../../../../../test/unit/data/investment/investment-data.json')
const urls = require('../../../../lib/urls')

describe('rendering Edit History', () => {
  const getInvestmentProjectAuditLogStub = sinon.stub()
  const transformAuditLogStub = sinon.stub()
  const controller = proxyquire('../edit-history', {
    '../repos': {
      getInvestmentProjectAuditLog: getInvestmentProjectAuditLogStub,
    },
    '../transformers/edit-history': {
      transformAuditLog: transformAuditLogStub,
    },
  })

  context('when "Edit History" renders successfully', () => {
    const middlewareParams = buildMiddlewareParameters({
      investment: investmentData,
    })

    getInvestmentProjectAuditLogStub.resolves({
      count: 1,
      next: null,
      previous: null,
      results: [],
    })

    transformAuditLogStub.returns([])

    before(async () => {
      await controller.renderProjectsView(
        middlewareParams.reqMock,
        middlewareParams.resMock,
        middlewareParams.nextSpy
      )
    })

    it('should render the edit history template', () => {
      const expectedTemplate = 'investments/views/edit-history'
      expect(middlewareParams.resMock.render).to.be.calledWith(
        expectedTemplate,
        {
          props: {
            dataEndpoint: urls.investments.editHistory.data(
              'f22ae6ac-b269-4fe5-aeba-d6a605b9a7a7'
            ),
          },
        }
      )
    })

    it('should add 1 breadcrumb', () => {
      expect(middlewareParams.resMock.breadcrumb.args).to.deep.equal([
        ['Edit History'],
      ])
    })

    it('should not call next() with an error', () => {
      expect(middlewareParams.nextSpy).to.not.have.been.called
    })
  })
})
