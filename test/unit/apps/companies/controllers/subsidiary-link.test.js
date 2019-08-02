const buildMiddlewareParameters = require('test/unit/helpers/middleware-parameters-builder.js')

const companyMock = require('test/unit/data/companies/minimal-company.json')
const { renderLinkSubsidiary } = require('src/apps/companies/controllers/subsidiary-link')

describe('Subsidiary link controller', () => {
  describe('#renderLinkSubsidiary', () => {
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
      expect(this.middlewareParameters.resMock.render).to.be.calledWith('companies/views/link-subsidiary.njk')
      expect(this.middlewareParameters.resMock.render).to.be.calledOnce
    })
  })
})
