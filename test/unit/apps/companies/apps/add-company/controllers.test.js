const config = require('~/config')
const {
  renderAddCompanyForm,
  postSearchDnbCompanies,
} = require('~/src/apps/companies/apps/add-company/controllers')

const buildMiddlewareParameters = require('~/test/unit/helpers/middleware-parameters-builder')

describe('Add company form controllers', () => {
  describe('#renderAddCompanyForm', () => {
    context('when the "Add company form" renders successfully', () => {
      beforeEach(async () => {
        this.middlewareParameters = buildMiddlewareParameters({})
        await renderAddCompanyForm(
          this.middlewareParameters.reqMock,
          this.middlewareParameters.resMock,
          this.middlewareParameters.nextSpy,
        )
      })

      it('should render the add company form template', () => {
        expect(this.middlewareParameters.resMock.render).to.be.calledOnceWithExactly(
          'companies/apps/add-company/views/client-container'
        )
      })

      it('should add a breadcrumb', () => {
        expect(this.middlewareParameters.resMock.breadcrumb.firstCall).to.be.calledWith('Add company')
      })

      it('should not call next() with an error', () => {
        expect(this.middlewareParameters.nextSpy).to.not.have.been.called
      })
    })

    context('when the rendering fails', () => {
      beforeEach(async () => {
        this.middlewareParameters = buildMiddlewareParameters({})

        this.error = new Error('Could not render')

        const errorRes = {
          ...this.middlewareParameters.resMock,
          render: () => { throw this.error },
        }

        await renderAddCompanyForm(
          this.middlewareParameters.reqMock,
          errorRes,
          this.middlewareParameters.nextSpy,
        )
      })

      it('should call next() with an error', () => {
        expect(this.middlewareParameters.nextSpy).to.have.been.calledOnceWithExactly(this.error)
      })
    })
  })

  describe('#postSearchDnbCompanies', () => {
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

        this.middlewareParameters = buildMiddlewareParameters({
          requestBody: {
            search_term: 'company',
            address_country: 'GB',
            page_size: 100,
          },
        })

        await postSearchDnbCompanies(
          this.middlewareParameters.reqMock,
          this.middlewareParameters.resMock,
          this.middlewareParameters.nextSpy,
        )
      })

      it('should respond with JSON', () => {
        expect(this.middlewareParameters.resMock.json).to.be.calledOnceWithExactly({
          count: 0,
          results: [],
        })
      })

      it('should not call next() with an error', () => {
        expect(this.middlewareParameters.nextSpy).to.not.have.been.called
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

        this.middlewareParameters = buildMiddlewareParameters({
          requestBody: {
            search_term: 'company',
            address_country: 'GB',
            page_size: 100,
          },
        })

        await postSearchDnbCompanies(
          this.middlewareParameters.reqMock,
          this.middlewareParameters.resMock,
          this.middlewareParameters.nextSpy,
        )
      })

      it('should not respond with JSON', () => {
        expect(this.middlewareParameters.resMock.json).to.not.have.been.called
      })

      it('should call next() with an error', () => {
        expect(this.middlewareParameters.nextSpy).to.have.been.calledOnceWithExactly(sinon.match({
          message: '500 - "Error message"',
        }))
      })
    })
  })
})
