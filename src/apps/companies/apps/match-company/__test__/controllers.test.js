const buildMiddlewareParameters = require('../../../../../../test/unit/helpers/middleware-parameters-builder')
const companyMock = require('../../../../../../test/unit/data/companies/company-v4.json')
const urls = require('../../../../../../src/lib/urls')

const { renderFindCompanyForm } = require('../controllers')

describe('Finding a company', () => {
  context('when "renderFindCompanyForm" renders successfully', () => {
    let middlewareParams
    beforeEach(async () => {
      middlewareParams = buildMiddlewareParameters({
        company: companyMock,
      })
      await renderFindCompanyForm(
        middlewareParams.reqMock,
        middlewareParams.resMock,
        middlewareParams.nextSpy
      )
    })

    it('should render the find a company form template with fields', () => {
      expect(middlewareParams.resMock.render).to.be.calledOnceWithExactly(
        'companies/apps/match-company/views/find-company',
        {
          props: {},
        }
      )
    })

    it('should add 2 breadcrumbs', () => {
      expect(middlewareParams.resMock.breadcrumb.args).to.deep.equal([
        [
          'Mercury Ltd',
          urls.companies.detail('a73efeba-8499-11e6-ae22-56b6b6499611'),
        ],
        ['Find this company record'],
      ])
    })

    it('should not call next() with an error', () => {
      expect(middlewareParams.nextSpy).to.not.have.been.called
    })
  })

  context('when "renderFindCompanyForm" errors', async () => {
    let middlewareParams

    before(async () => {
      middlewareParams = buildMiddlewareParameters({
        company: companyMock,
      })
      middlewareParams.resMock.render.throws()

      await renderFindCompanyForm(
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
