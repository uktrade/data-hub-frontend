const buildMiddlewareParameters = require('~/test/unit/helpers/middleware-parameters-builder.js')

const companyMock = require('~/test/unit/data/companies/minimal-company.json')
const { renderLinkSubsidiary } = require('~/src/apps/companies/controllers/subsidiary-link')

describe('Subsidiary link controller', () => {
  describe('#renderLinkSubsidiary', () => {
    const commonTests = (expectedTemplate) => {
      it('should add two breadcrumbs', () => {
        expect(this.middlewareParameters.resMock.breadcrumb).to.be.calledTwice
      })

      it('should add the company breadcrumb', () => {
        expect(this.middlewareParameters.resMock.breadcrumb).to.be.calledWith(companyMock.name, `/companies/${companyMock.id}`)
      })

      it('should add the "Link subsidiary" breadcrumb', () => {
        expect(this.middlewareParameters.resMock.breadcrumb).to.be.calledWith('Link subsidiary')
      })

      it('should render the view', () => {
        expect(this.middlewareParameters.resMock.render).to.be.calledWith(expectedTemplate)
        expect(this.middlewareParameters.resMock.render).to.be.calledOnce
      })
    }

    context('when the companies new layout flag is enabled', () => {
      beforeEach(() => {
        this.middlewareParameters = buildMiddlewareParameters({
          company: companyMock,
        })

        renderLinkSubsidiary(
          this.middlewareParameters.reqMock,
          this.middlewareParameters.resMock,
          this.middlewareParameters.nextSpy,
        )
      })

      commonTests('companies/views/_deprecated/link-subsidiary.njk')
    })

    context('when the companies new layout flag is not enabled', () => {
      beforeEach(() => {
        this.middlewareParameters = buildMiddlewareParameters({
          company: companyMock,
          features: {
            'companies-new-layout': true,
          },
        })

        renderLinkSubsidiary(
          this.middlewareParameters.reqMock,
          this.middlewareParameters.resMock,
          this.middlewareParameters.nextSpy,
        )
      })

      commonTests('companies/views/link-subsidiary.njk')
    })
  })
})
