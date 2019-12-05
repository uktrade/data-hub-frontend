describe('title middleware', () => {
  beforeEach(() => {
    this.title = require('../title')()
  })

  describe('set title', () => {
    it('should set title to the string passed', () => {
      const nextSpy = sinon.spy()
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
