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
      { path: 'first', label: 'First' },
      { path: 'second', label: 'Second' },
    ]

    it('should attach nav items props to locals', () => {
      const reqMock = {
        baseUrl: '/sub-app',
      }
      const resMock = {
        locals: {
          CURRENT_PATH: '/sub-app/resource',
        },
      }

      this.middleware.setLocalNav(NAV_ITEMS)(reqMock, resMock, this.nextSpy)

      expect(resMock.locals).to.haveOwnProperty('localNavItems')
      expect(resMock.locals.localNavItems[0].url).to.equal('/sub-app/first')
      expect(resMock.locals.localNavItems[0].isActive).to.be.false
      expect(this.nextSpy.calledOnce).to.be.true
    })

    it('should set new isActive to true for the current path', () => {
      const reqMock = {
        baseUrl: '/sub-app',
      }
      const resMock = {
        locals: {
          CURRENT_PATH: '/sub-app/first',
        },
      }
      this.middleware.setLocalNav(NAV_ITEMS)(reqMock, resMock, this.nextSpy)

      expect(resMock.locals).to.haveOwnProperty('localNavItems')
      expect(resMock.locals.localNavItems[0].url).to.equal('/sub-app/first')
      expect(resMock.locals.localNavItems[0].isActive).to.be.true
      expect(this.nextSpy.calledOnce).to.be.true
    })
  })

  describe('redirectToFirstNavItem()', () => {
    const NAV_ITEMS = [{
      path: 'first',
      label: 'First',
      url: '/base-url/first',
    }, {
      path: 'second',
      label: 'Second',
      url: '/base-url/second',
    }]

    it('should redirect to the first item', () => {
      const redirectMock = this.sandbox.spy()
      const resMock = this.reqMock = Object.assign({}, globalRes, {
        redirect: redirectMock,
        locals: {
          localNavItems: NAV_ITEMS,
        },
      })

      this.middleware.redirectToFirstNavItem({}, resMock)

      expect(redirectMock).to.have.been.calledWith('/base-url/first')
    })
  })
})
