describe('Investment index controller', () => {
  beforeEach(() => {
    this.controller = require('~/src/controllers/investment/shared.middleware')
    this.sandbox = sinon.sandbox.create()
  })

  afterEach(() => {
    this.sandbox.restore()
  })

  describe('#getLocalNavMiddleware', () => {
    it('should return local nav items', () => {
      const nextSpy = this.sandbox.spy()
      const resMock = { locals: {} }

      this.controller.getLocalNavMiddleware({}, resMock, nextSpy)

      expect(resMock.locals).to.haveOwnProperty('localNavItems')
      expect(nextSpy.calledOnce).to.be.true
    })
  })
})
