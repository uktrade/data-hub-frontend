describe('title middleware', () => {
  beforeEach(() => {
    this.title = require('~/src/middleware/title')()
    this.sandbox = sinon.sandbox.create()
  })

  afterEach(() => {
    this.sandbox.restore()
  })

  describe('set title', () => {
    it('should set title to the string passed', () => {
      const nextSpy = this.sandbox.spy()
      const resMock = { locals: {} }
      const testTitle = 'Test title'

      this.title({}, resMock, nextSpy)

      expect(resMock).to.have.property('title')
      expect(resMock.title).to.be.a('function')

      resMock.title(testTitle)

      expect(resMock.locals.title).to.equal(testTitle)
      expect(nextSpy.calledOnce).to.be.true
    })
  })
})
