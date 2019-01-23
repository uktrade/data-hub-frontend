describe('Apps middleware', () => {
  beforeEach(() => {
    this.middleware = require('~/src/apps/middleware')
    this.nextSpy = sinon.spy()
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
      const redirectMock = sinon.spy()
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
        redirect: sinon.spy(),
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

  describe('handleRoutePermissions()', () => {
    const mockUrl = '/mock-url'

    beforeEach(() => {
      this.reqMock = {
        originalUrl: mockUrl,
      }
      this.resMock = {
        locals: {
          user: {
            permissions: [
              'permission1',
            ],
          },
        },
      }
    })

    context('when route is permitted', () => {
      beforeEach(() => {
        this.middleware.handleRoutePermissions([
          {
            path: mockUrl,
            permissions: [
              'permission1',
            ],
          },
        ])(this.reqMock, this.resMock, this.nextSpy)
      })

      it('should call next', () => {
        expect(this.nextSpy).to.be.calledOnce
      })

      it('should call next without error', () => {
        expect(this.nextSpy).to.be.calledWith()
      })
    })

    context('when route is not permitted', () => {
      beforeEach(() => {
        this.middleware.handleRoutePermissions([
          {
            path: mockUrl,
            permissions: [
              'permission2',
            ],
          },
        ])(this.reqMock, this.resMock, this.nextSpy)
      })

      it('should call next', () => {
        expect(this.nextSpy).to.be.calledOnce
      })

      it('should call next with error', () => {
        expect(this.nextSpy).to.be.calledWith({ statusCode: 403 })
      })
    })

    context('when route permissions are empty', () => {
      beforeEach(() => {
        this.middleware.handleRoutePermissions([
          {
            path: mockUrl,
            permissions: [],
          },
        ])(this.reqMock, this.resMock, this.nextSpy)
      })

      it('should call next ', () => {
        expect(this.nextSpy).to.be.calledOnce
      })

      it('should call next with error', () => {
        expect(this.nextSpy).to.be.calledWith()
      })
    })

    context('when route permissions are undefined', () => {
      beforeEach(() => {
        this.middleware.handleRoutePermissions([
          { path: mockUrl },
        ])(this.reqMock, this.resMock, this.nextSpy)
      })

      it('should call next', () => {
        expect(this.nextSpy).to.be.calledOnce
      })

      it('should call next with error', () => {
        expect(this.nextSpy).to.be.calledWith()
      })
    })
  })

  describe('isPermittedRoute()', () => {
    const mockPathname = 'mock-pathname'
    const mockPathnameOther = 'mock-pathname-other'

    beforeEach(() => {
      this.routes = [
        {
          path: mockPathname,
          permissions: [
            'permission1',
          ],
        },
        {
          path: 'mock-url-other',
        },
      ]
    })

    context('when matching route is permitted', () => {
      beforeEach(() => {
        this.isPermittedRoute = this.middleware.isPermittedRoute(
          mockPathname,
          this.routes,
          [
            'permission1',
            'permission2',
          ]
        )
      })

      it('should return true', () => {
        expect(this.isPermittedRoute).to.be.true
      })
    })

    context('when matching route is permitted', () => {
      beforeEach(() => {
        this.isPermittedRoute = this.middleware.isPermittedRoute(
          mockPathname,
          this.routes,
          [
            'permission5',
            'permission7',
          ]
        )
      })

      it('should return false when matching route is not permitted', () => {
        expect(this.isPermittedRoute).to.be.false
      })
    })

    context('when matching route is permitted', () => {
      beforeEach(() => {
        this.isPermittedRoute = this.middleware.isPermittedRoute(
          mockPathnameOther,
          this.routes,
          [
            'permission5',
            'permission7',
          ]
        )
      })

      it('should return true when matching route has no permissions', () => {
        expect(this.isPermittedRoute).to.be.true
      })
    })
  })
  // (isLegacyProject, documentsLabel, filterOnPermissions, item) {
  describe('removeDocumentsFromLHNav', () => {
    const NAV_ITEMS = [{
      path: 'propositions', label: 'Propositions',
    }, {
      path: 'evaluation', label: 'Evaluations',
    }, {
      path: 'audit', label: 'Audit history',
    }, {
      path: 'documents', label: 'CDMS Documents', permissions: ['permission1'],
    }]
    beforeEach(() => {
      this.isLegacyProject = true
      this.docLabel = NAV_ITEMS[3].label
      this.filterOnPermissions = sinon.stub().returns(true)
    })

    context('when the item passed into the iterator function is not \'documents\' but is a legacy project', () => {
      beforeEach(() => {
        this.item = NAV_ITEMS[0]
        // this.fnReturnedByRemoveDocumentsFromLHNav = this.middleware.removeDocumentsFromLHNav(this.projectCode, this.docLabel, this.filterOnPermissions)
      })

      it('should call \'filterOnPermissions()\'', () => {
        this.middleware.removeDocumentsFromLHNav(this.isLegacyProject, this.docLabel, this.filterOnPermissions, this.item)
        expect(this.filterOnPermissions.calledOnce).to.be.true
      })

      it('should return whatever  \'filterOnPermissions()\' returns', () => {
        let expected = this.middleware.removeDocumentsFromLHNav(this.isLegacyProject, this.docLabel, this.filterOnPermissions, this.item)
        expect(expected).to.be.true
        this.filterOnPermissions = sinon.stub().returns(false)
        expected = this.middleware.removeDocumentsFromLHNav(this.projectCode, this.docLabel, this.filterOnPermissions, this.item)
        expect(expected).to.be.false
      })
    })
    context('when the item passed into the iterator function is \'documents\' and is also a legacy project', () => {
      beforeEach(() => {
        this.item = NAV_ITEMS[3]
        // this.fnReturnedByRemoveDocumentsFromLHNav = this.middleware.removeDocumentsFromLHNav(this.projectCode, this.docLabel, this.filterOnPermissions)
      })

      it('should call not call \'filterOnPermissions()\' if this is a legacy project', () => {
        expect(this.isLegacyProject).to.be.true
        expect(this.docLabel).to.equal('CDMS Documents')
        this.middleware.removeDocumentsFromLHNav(this.isLegacyProject, this.docLabel, this.filterOnPermissions, this.item)
        expect(this.filterOnPermissions.calledOnce).to.be.false
      })

      it('should return FALSE if this is a legacy project', () => {
        const expected = this.middleware.removeDocumentsFromLHNav(this.isLegacyProject, this.docLabel, this.filterOnPermissions, this.item)
        expect(expected).to.be.false
      })

      it('should return TRUE if this is not a legacy project', () => {
        this.isLegacyProject = false
        expect(this.docLabel).to.equal('CDMS Documents')
        const expected = this.middleware.removeDocumentsFromLHNav(this.isLegacyProject, this.docLabel, this.filterOnPermissions, this.item)
        expect(expected).to.be.true
      })
    })
  })
})
