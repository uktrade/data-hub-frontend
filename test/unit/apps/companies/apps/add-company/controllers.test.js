const { renderAddCompanyForm } = require('~/src/apps/companies/apps/add-company/controllers')

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

      it('should render', () => {
        expect(this.middlewareParameters.resMock.render).to.be.calledOnce
      })

      it('should render the add company form template', () => {
        expect(this.middlewareParameters.resMock.render).to.be.calledOnceWithExactly(
          'companies/apps/add-company/views/client-container'
        )
      })

      it('should add a breadcrumb', () => {
        expect(this.middlewareParameters.resMock.breadcrumb.firstCall).to.be.calledWith('Add company')
      })

      it('should not call "next" with an error', async () => {
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

      it('should call "next" with an error', async () => {
        expect(this.middlewareParameters.nextSpy).to.have.been.calledWith(this.error)
      })
    })
  })
})
