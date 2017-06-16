describe('CRSF token', () => {
  beforeEach(() => {
    this.csrfMiddleware = require('~/src/middleware/csrf-token')()
    this.sandbox = sinon.sandbox.create()
  })

  afterEach(() => {
    this.sandbox.restore()
  })

  describe('set a CSRF token', () => {
    it('should set the csrf token on response locals object', () => {
      const csrfSpy = this.sandbox.spy()
      const nextSpy = this.sandbox.spy()
      const reqMock = { csrfToken: csrfSpy }
      const resMock = { locals: {} }

      this.csrfMiddleware(reqMock, resMock, nextSpy)

      expect(csrfSpy.calledOnce).to.be.true
      expect(resMock.locals).to.have.property('csrfToken')
      expect(nextSpy.calledOnce).to.be.true
    })
  })
})
