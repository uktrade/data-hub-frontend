const buildMiddlewareParameters = require('../../../../../test/unit/helpers/middleware-parameters-builder')

const { renderDetails } = require('../details')

describe('Companies details controller', () => {
  describe('#renderDetails', () => {
    beforeEach(async () => {
      this.middlewareParameters = buildMiddlewareParameters({})

      await renderDetails(
        this.middlewareParameters.reqMock,
        this.middlewareParameters.resMock,
        this.middlewareParameters.nextSpy
      )
    })

    it('should permanently redirect to interactions', () => {
      expect(this.middlewareParameters.resMock.redirect).to.have.been.calledWith(301, 'interactions')
      expect(this.middlewareParameters.resMock.redirect).to.have.been.calledOnce
    })

    it('should not render a template', () => {
      expect(this.middlewareParameters.resMock.render).to.not.be.called
    })
  })
})
