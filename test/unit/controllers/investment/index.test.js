describe('Investment index controller', () => {
  beforeEach(() => {
    this.controller = require('~/src/controllers/investment')
    this.sandbox = sinon.sandbox.create()
  })

  afterEach(() => {
    this.sandbox.restore()
  })

  describe('#handleEmptyMiddleware', () => {
    it('should redirect to start when no sub-routes are given', (done) => {
      const nextSpy = this.sandbox.spy()

      this.controller.handleEmptyMiddleware({
        path: '/',
      }, {
        locals: {},
        redirect (url) {
          expect(url).to.equal('/investment/start')
          done()
        },
      }, nextSpy)
    })

    it('should pass to the next middleware for any other path', () => {
      const nextSpy = this.sandbox.spy()
      const mockRes = { locals: {} }

      this.controller.handleEmptyMiddleware({
        path: '/create',
      }, mockRes, nextSpy)

      expect(nextSpy.calledOnce).to.be.true
    })
  })
})
