describe('Apps middleware', () => {
  beforeEach(() => {
    this.sandbox = sinon.sandbox.create()
    this.middleware = require('~/src/apps/middleware')

    this.nextSpy = this.sandbox.spy()
  })

  afterEach(() => {
    this.sandbox.restore()
  })

  describe('setLocalNav()', () => {
    const NAV_ITEMS = [
      { path: '../first', label: 'First' },
      { path: '../second', label: 'Second' },
    ]

    it('should attach nav items props to locals', () => {
      const resMock = {
        locals: {
          CURRENT_PATH: '/sub-app/resource',
        },
      }

      this.middleware.setLocalNav(NAV_ITEMS)({}, resMock, this.nextSpy)

      expect(resMock.locals).to.haveOwnProperty('localNavItems')
      expect(resMock.locals.localNavItems[0].url).to.equal('/sub-app/first')
      expect(resMock.locals.localNavItems[0].isActive).to.be.false
      expect(this.nextSpy.calledOnce).to.be.true
    })

    it('should set new isActive to true for the current path', () => {
      const resMock = {
        locals: {
          CURRENT_PATH: '/sub-app/first',
        },
      }
      this.middleware.setLocalNav(NAV_ITEMS)({}, resMock, this.nextSpy)

      expect(resMock.locals).to.haveOwnProperty('localNavItems')
      expect(resMock.locals.localNavItems[0].url).to.equal('/sub-app/first')
      expect(resMock.locals.localNavItems[0].isActive).to.be.true
      expect(this.nextSpy.calledOnce).to.be.true
    })
  })
})
