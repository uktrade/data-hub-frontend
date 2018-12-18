const buildMiddlewareParameters = require('~/test/unit/helpers/middleware-parameters-builder.js')

const dnbCompanyMock = require('~/test/unit/data/companies/dnb-company.json')

const { renderBusinessDetails } = require('~/src/apps/companies/controllers/business-details')

describe('#renderBusinessDetails', () => {
  context('when blah', () => {
    beforeEach(async () => {
      this.middlewareParameters = buildMiddlewareParameters({
        company: dnbCompanyMock,
      })

      await renderBusinessDetails(
        this.middlewareParameters.reqMock,
        this.middlewareParameters.resMock,
        this.middlewareParameters.nextSpy,
      )
    })

    it('should set the company breadcrumb', () => {
      const expectedName = dnbCompanyMock.name
      const expectedUrl = `/companies/${dnbCompanyMock.id}`

      expect(this.middlewareParameters.resMock.breadcrumb).to.be.calledWithExactly(expectedName, expectedUrl)
    })

    it('should set the business details breadcrumb', () => {
      expect(this.middlewareParameters.resMock.breadcrumb).to.be.calledWithExactly('Business details')
    })

    it('should render the business details view', () => {
      expect(this.middlewareParameters.resMock.render.firstCall.args[0]).to.equal('companies/views/business-details')
    })

    it('should set the heading', () => {
      expect(this.middlewareParameters.resMock.render.firstCall.args[1].heading).to.equal('Business details')
    })

    it('set the known as details', () => {
      expect(this.middlewareParameters.resMock.render.firstCall.args[1].knownAsDetails).to.not.be.undefined
    })
  })
})
