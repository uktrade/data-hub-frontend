const buildMiddlewareParameters = require('~/test/unit/helpers/middleware-parameters-builder.js')

const { renderDetails } = require('~/src/apps/companies/controllers/details')

const companiesHouseCompany = require('~/test/unit/data/companies/companies-house-company.json')
const minimalCompany = require('~/test/unit/data/companies/minimal-company.json')
const dnbCompany = require('~/test/unit/data/companies/dnb-company.json')
const config = require('~/config')

describe('Companies details controller', () => {
  describe('#renderDetails', () => {
    const commonTests = (expectedBreadcrumb, expectedTemplate) => {
      it('should add a breadcrumb', () => {
        const breadcrumbSpy = this.middlewareParameters.resMock.breadcrumb

        expect(breadcrumbSpy).to.be.calledWith(expectedBreadcrumb.text)
        expect(breadcrumbSpy).to.have.been.calledOnce
      })

      it('should render the correct template', () => {
        const templateName = this.middlewareParameters.resMock.render.firstCall.args[0]
        expect(templateName).to.equal(expectedTemplate)
      })

      it('should include company details', () => {
        const options = this.middlewareParameters.resMock.render.firstCall.args[1]
        expect(options.companyDetails).to.not.be.null
      })

      it('should include account management details', () => {
        const options = this.middlewareParameters.resMock.render.firstCall.args[1]
        expect(options.accountManagementDetails).to.not.be.null
      })

      it('should include one list information', () => {
        const options = this.middlewareParameters.resMock.render.firstCall.args[1]
        expect(options.accountManagementDetails).to.not.be.null
      })

      it('should include a link to the One List support email', () => {
        const options = this.middlewareParameters.resMock.render.firstCall.args[1]
        expect(options.oneListEmail).to.equal(config.oneList.email)
      })
    }

    context('when the company contains Companies House data', () => {
      beforeEach(async () => {
        this.middlewareParameters = buildMiddlewareParameters({
          company: companiesHouseCompany,
        })

        await renderDetails(
          this.middlewareParameters.reqMock,
          this.middlewareParameters.resMock,
          this.middlewareParameters.nextSpy
        )
      })

      commonTests({ text: 'SAMSUNG BIOEPIS UK LIMITED' }, 'companies/views/_deprecated/details')

      it('should include companies house details', () => {
        const options = this.middlewareParameters.resMock.render.firstCall.args[1]
        expect(options.chDetails).to.not.be.null
      })
    })

    context('when the company has no companies house data', () => {
      beforeEach(async () => {
        this.middlewareParameters = buildMiddlewareParameters({
          company: minimalCompany,
        })

        await renderDetails(
          this.middlewareParameters.reqMock,
          this.middlewareParameters.resMock,
          this.middlewareParameters.nextSpy
        )
      })

      commonTests({ text: 'SAMSUNG BIOEPIS UK LIMITED' }, 'companies/views/_deprecated/details')

      it('should not include Companies House details', () => {
        const options = this.middlewareParameters.resMock.render.firstCall.args[1]
        expect(options.chDetails).to.be.null
      })
    })

    context('when the company is a Dun & Bradstreet company', () => {
      beforeEach(async () => {
        this.middlewareParameters = buildMiddlewareParameters({
          company: dnbCompany,
        })

        await renderDetails(
          this.middlewareParameters.reqMock,
          this.middlewareParameters.resMock,
          this.middlewareParameters.nextSpy
        )
      })

      it('should not render the template', () => {
        expect(this.middlewareParameters.resMock.render).to.not.be.called
      })

      it('should not add breadcrumbs', () => {
        expect(this.middlewareParameters.resMock.breadcrumb).to.not.be.called
      })

      it('should redirect to interactions', () => {
        expect(this.middlewareParameters.resMock.redirect).to.have.been.calledWith('interactions')
        expect(this.middlewareParameters.resMock.redirect).to.have.been.calledOnce
      })
    })
  })
})
