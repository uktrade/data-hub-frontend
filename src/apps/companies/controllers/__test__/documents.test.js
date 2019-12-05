const buildMiddlewareParameters = require('../../../../../test/unit/helpers/middleware-parameters-builder')

const { renderDocuments } = require('../documents')

describe('Companies documents controller', () => {
  describe('#renderDocuments', () => {
    beforeEach(async () => {
      this.middlewareParameters = buildMiddlewareParameters({})

      await renderDocuments(
        this.middlewareParameters.reqMock,
        this.middlewareParameters.resMock,
        this.middlewareParameters.nextSpy
      )
    })

    it('should permanently redirect to business details', () => {
      expect(this.middlewareParameters.resMock.redirect).to.have.been.calledWith(301, 'business-details')
      expect(this.middlewareParameters.resMock.redirect).to.have.been.calledOnce
    })

    it('should not render a template', () => {
      expect(this.middlewareParameters.resMock.render).to.not.be.called
    })
  })
})
