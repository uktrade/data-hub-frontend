const buildMiddlewareParameters = require('../../../../../../test/unit/helpers/middleware-parameters-builder')
const companyMock = require('../../../../../../test/unit/data/companies/company-v4.json')
const urls = require('../../../../../../src/lib/urls')
const config = require('../../../../../config')

const { renderFindCompanyForm, findDnbCompany } = require('../controllers')

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
          props: {
            company: {
              id: 'a73efeba-8499-11e6-ae22-56b6b6499611',
            },
          },
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

  describe('findDnbCompany', () => {
    context('when the search is successful', () => {
      beforeEach(async () => {
        nock(config.apiRoot)
          .post(`/v4/dnb/company-search`, {
            search_term: 'company',
            address_country: 'GB',
            page_size: 100,
          })
          .reply(200, {
            count: 0,
            results: [],
          })

        middlewareParameters = buildMiddlewareParameters({
          requestBody: {
            search_term: 'company',
            address_country: 'GB',
            page_size: 100,
          },
        })

        await findDnbCompany(
          middlewareParameters.reqMock,
          middlewareParameters.resMock,
          middlewareParameters.nextSpy
        )
      })

      it('should respond with JSON', () => {
        expect(middlewareParameters.resMock.json).to.be.calledOnceWithExactly({
          count: 0,
          results: [],
        })
      })

      it('should not call next() with an error', () => {
        expect(middlewareParameters.nextSpy).to.not.have.been.called
      })
    })

    context('when the search fails', () => {
      beforeEach(async () => {
        nock(config.apiRoot)
          .post(`/v4/dnb/company-search`, {
            search_term: 'company',
            address_country: 'GB',
            page_size: 100,
          })
          .reply(500, 'Error message')

        middlewareParameters = buildMiddlewareParameters({
          requestBody: {
            search_term: 'company',
            address_country: 'GB',
            page_size: 100,
          },
        })

        await findDnbCompany(
          middlewareParameters.reqMock,
          middlewareParameters.resMock,
          middlewareParameters.nextSpy
        )
      })

      it('should not respond with JSON', () => {
        expect(middlewareParameters.resMock.json).to.not.have.been.called
      })

      it('should call next() with an error', () => {
        expect(middlewareParameters.nextSpy).to.have.been.calledOnceWithExactly(
          sinon.match({
            message: '500 - "Error message"',
          })
        )
      })
    })
  })
})
