describe('Apps middleware', () => {
  beforeEach(() => {
    this.middleware = require('~/src/apps/middleware')
    this.nextSpy = sandbox.spy()
  })

  describe('setLocalNav()', () => {
    const NAV_ITEMS = [
      {
        path: 'first',
        label: 'First',
      },
      {
        path: 'second',
        label: 'Second',
      },
      {
        path: 'third',
        label: 'Third',
        permissions: [
          'permission1',
        ],
      },
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

      expect(resMock.locals.localNavItems[0].url).to.equal('/sub-app/first')
      expect(resMock.locals.localNavItems[0].isActive).to.be.true
      expect(this.nextSpy.calledOnce).to.be.true
    })

    context('when a nav item has the external property set', () => {
      it('should set url on the nav item link to url value', () => {
        const url = 'http://url/path'
        const mockNavItem = {
          url,
          isExternal: true,
        }
        const reqMock = {}
        const resMock = {
          locals: {},
        }

        this.middleware.setLocalNav([mockNavItem])(reqMock, resMock, this.nextSpy)

        expect(resMock.locals.localNavItems[0].url).to.equal(url)
        expect(resMock.locals.localNavItems[0].isActive).to.be.false
        expect(this.nextSpy.calledOnce).to.be.true
      })
    })

    context('user permitted nav items', () => {
      it('should include permitted items', () => {
        const reqMock = {
          baseUrl: '/sub-app',
        }
        const resMock = {
          locals: {
            CURRENT_PATH: '/sub-app/first',
            user: {
              permissions: [
                'permission1',
              ],
            },
          },
        }
        const expectedNavItems = [
          {
            path: 'first',
            label: 'First',
            url: '/sub-app/first',
            isActive: true,
          },
          {
            path: 'second',
            label: 'Second',
            url: '/sub-app/second',
            isActive: false,
          },
          {
            path: 'third',
            label: 'Third',
            permissions: [
              'permission1',
            ],
            url: '/sub-app/third',
            isActive: false,
          }]
        this.middleware.setLocalNav(NAV_ITEMS)(reqMock, resMock, this.nextSpy)

        expect(resMock.locals.localNavItems).to.deep.equal(expectedNavItems)
      })

      it('should only include permitted items', () => {
        const reqMock = {
          baseUrl: '/sub-app',
        }
        const resMock = {
          locals: {
            CURRENT_PATH: '/sub-app/first',
          },
        }
        const expectedNavItems = [
          {
            path: 'first',
            label: 'First',
            url: '/sub-app/first',
            isActive: true,
          },
          {
            path: 'second',
            label: 'Second',
            url: '/sub-app/second',
            isActive: false,
          },
        ]
        this.middleware.setLocalNav(NAV_ITEMS)(reqMock, resMock, this.nextSpy)

        expect(resMock.locals.localNavItems).to.deep.equal(expectedNavItems)
      })
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
      const redirectMock = sandbox.spy()
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

  describe('setDefaultQuery()', () => {
    beforeEach(() => {
      this.resMock = {
        redirect: sandbox.spy(),
      }
    })

    it('should redirect to default query if initial query is empty', () => {
      const reqMock = {
        query: {},
        originalUrl: '/sub-app',
      }
      this.middleware.setDefaultQuery({
        filter: 'apple',
        sortby: 'sweetness',
      })(reqMock, this.resMock, this.nextSpy)

      expect(this.nextSpy).to.not.have.been.called
      expect(this.resMock.redirect).to.be.calledWith('/sub-app?filter=apple&sortby=sweetness')
    })

    it('should not redirect if query contains properties', () => {
      const reqMock = {
        query: {
          filter: 'pear',
        },
        originalUrl: '/sub-app',
      }

      this.middleware.setDefaultQuery({
        filter: 'apple',
        sortby: 'sweetness',
      })(reqMock, this.resMock, this.nextSpy)

      expect(this.nextSpy).to.have.been.called
      expect(this.resMock.redirect).to.not.have.been.called
    })
  })
})
