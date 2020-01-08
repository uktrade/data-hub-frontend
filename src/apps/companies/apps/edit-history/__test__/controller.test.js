const buildMiddlewareParameters = require('../../../../../../test/unit/helpers/middleware-parameters-builder')
const companyMock = require('../../../../../../test/unit/data/companies/company-v4.json')
const urls = require('../../../../../../src/lib/urls')

const proxyquire = require('proxyquire')

describe('rendering Edit History', () => {
  const getCompanyAuditLogStub = sinon.stub()
  const transformCompanyAuditLogStub = sinon.stub()
  const controller = proxyquire('../controller', {
    '../../repos': {
      getCompanyAuditLog: getCompanyAuditLogStub,
    },
    './transformers': {
      transformCompanyAuditLog: transformCompanyAuditLogStub,
    },
  })

  context('when "Edit History" renders successfully', () => {
    const middlewareParams = buildMiddlewareParameters({
      company: companyMock,
    })

    getCompanyAuditLogStub.resolves({
      count: 1,
      next: null,
      previous: null,
      results: [],
    })

    transformCompanyAuditLogStub.returns([])

    before(async () => {
      await controller.renderEditHistory(
        middlewareParams.reqMock,
        middlewareParams.resMock,
        middlewareParams.nextSpy
      )
    })

    it('should render the add company form template with fields', () => {
      const expectedTemplate =
        'companies/apps/edit-history/views/client-container'
      expect(middlewareParams.resMock.render).to.be.calledOnceWithExactly(
        expectedTemplate,
        {
          props: {
            dataEndpoint: urls.companies.editHistory.data(
              'a73efeba-8499-11e6-ae22-56b6b6499611'
            ),
          },
        }
      )
    })

    it('should add 3 breadcrumbs', () => {
      expect(middlewareParams.resMock.breadcrumb.args).to.deep.equal([
        [
          'Mercury Ltd',
          urls.companies.detail('a73efeba-8499-11e6-ae22-56b6b6499611'),
        ],
        [
          'Business details',
          urls.companies.businessDetails(
            'a73efeba-8499-11e6-ae22-56b6b6499611'
          ),
        ],
        ['Edit History'],
      ])
    })

    it('should not call next() with an error', () => {
      expect(middlewareParams.nextSpy).to.not.have.been.called
    })
  })

  context('when "Edit History" errors', async () => {
    const middlewareParams = buildMiddlewareParameters({
      company: companyMock,
    })

    middlewareParams.resMock.render.throws()

    before(async () => {
      await controller.renderEditHistory(
        middlewareParams.reqMock,
        middlewareParams.resMock,
        middlewareParams.nextSpy
      )
    })

    it('should not call render', () => {
      expect(middlewareParams.resMock.render).to.be.thrown
    })

    it('should call next in the catch', () => {
      expect(middlewareParams.nextSpy).to.be.calledOnce
    })
  })
})
