const buildMiddlewareParameters = require('../../../../../../../test/unit/helpers/middleware-parameters-builder')

const companyMock = require('../../../../../../../test/unit/data/companies/company-v4.json')

const { renderSelect } = require('../select')

describe('Companies matching select controller', () => {
  describe('#renderSelect', () => {
    beforeEach(async () => {
      this.middlewareParameters = buildMiddlewareParameters({
        company: companyMock,
      })

      await renderSelect(
        this.middlewareParameters.reqMock,
        this.middlewareParameters.resMock,
        this.middlewareParameters.nextSpy
      )
    })

    it('should add two breadcrumbs', () => {
      expect(this.middlewareParameters.resMock.breadcrumb).to.be.calledTwice
    })

    it('should add a company breadcrumb', () => {
      expect(
        this.middlewareParameters.resMock.breadcrumb
      ).to.be.calledWithExactly(
        companyMock.name,
        `/companies/${companyMock.id}`
      )
    })

    it('should add a "Select match" breadcrumb', () => {
      expect(
        this.middlewareParameters.resMock.breadcrumb
      ).to.be.calledWithExactly('Select the match')
    })

    it('should render the view', () => {
      expect(
        this.middlewareParameters.resMock.render.firstCall.args[0]
      ).to.equal('companies/apps/matching/views/select')
    })

    it('should set the heading', () => {
      expect(
        this.middlewareParameters.resMock.render.firstCall.args[1].heading
      ).to.equal(`Select the match for ${companyMock.name}`)
    })
  })
})
