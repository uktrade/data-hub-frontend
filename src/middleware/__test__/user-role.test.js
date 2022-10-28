const buildMiddlewareParameters = require('../../../test/unit/helpers/middleware-parameters-builder')
const userRole = require('../user-role')
const urls = require('../../lib/urls')

describe('user-role middleware', () => {
  context('when the user has the role of "International Trade Team"', () => {
    const middlewareParameters = buildMiddlewareParameters({
      reqMock: {
        originalUrl: '/',
      },
      locals: {
        user: {
          dit_team: {
            id: '1',
            name: 'DIT South East - International Trade Team',
            role: {
              name: 'International Trade Team',
              id: '2',
            },
          },
        },
        isFeatureTesting: true,
      },
    })

    userRole(
      middlewareParameters.reqMock,
      middlewareParameters.resMock,
      middlewareParameters.nextSpy
    )

    it('should redirect to the dashboard "Pipeline" tab', () => {
      expect(middlewareParameters.resMock.redirect).calledOnceWithExactly(
        urls.pipeline.index()
      )
      expect(middlewareParameters.nextSpy).not.to.have.been.called
    })
  })

  context(
    'when the user has the role of "International Trade Director"',
    () => {
      const middlewareParameters = buildMiddlewareParameters({
        reqMock: {
          originalUrl: '/',
        },
        locals: {
          user: {
            dit_team: {
              id: '1',
              name: 'DIT South East - International Trade Director',
              role: {
                name: 'International Trade Director',
                id: '2',
              },
            },
          },
          isFeatureTesting: true,
        },
      })

      userRole(
        middlewareParameters.reqMock,
        middlewareParameters.resMock,
        middlewareParameters.nextSpy
      )

      it('should redirect to the dashboard "Pipeline" tab', () => {
        expect(middlewareParameters.resMock.redirect).calledOnceWithExactly(
          urls.pipeline.index()
        )
        expect(middlewareParameters.nextSpy).not.to.have.been.called
      })
    }
  )

  context(
    'when the user does not have the role of "International Trade Team"',
    () => {
      const middlewareParameters = buildMiddlewareParameters({
        locals: {
          user: {
            dit_team: {
              role: {
                name: 'UKTI HQ Department',
              },
            },
          },
        },
      })

      userRole(
        middlewareParameters.reqMock,
        middlewareParameters.resMock,
        middlewareParameters.nextSpy
      )

      it('should call next() and not redirect to the dashboard "Pipeline" tab', () => {
        expect(middlewareParameters.nextSpy).to.have.been.called
        expect(middlewareParameters.resMock.redirect).not.to.have.been.called
      })
    }
  )

  context('when the user does not have a team', () => {
    const middlewareParameters = buildMiddlewareParameters({
      reqMock: {
        originalUrl: '/',
      },
      locals: {
        user: {},
        isFeatureTesting: true,
      },
    })

    userRole(
      middlewareParameters.reqMock,
      middlewareParameters.resMock,
      middlewareParameters.nextSpy
    )

    it('should call next() and not redirect to the dashboard "Pipeline" tab', () => {
      expect(middlewareParameters.nextSpy).to.have.been.called
      expect(middlewareParameters.resMock.redirect).not.to.have.been.called
    })
  })

  context('when the user has a team but not a role', () => {
    const middlewareParameters = buildMiddlewareParameters({
      reqMock: {
        originalUrl: '/',
      },
      locals: {
        user: {
          dit_team: {},
        },
        isFeatureTesting: true,
      },
    })

    userRole(
      middlewareParameters.reqMock,
      middlewareParameters.resMock,
      middlewareParameters.nextSpy
    )

    it('should call next() and not redirect to the dashboard "Pipeline" tab', () => {
      expect(middlewareParameters.nextSpy).to.have.been.called
      expect(middlewareParameters.resMock.redirect).not.to.have.been.called
    })
  })

  context('when the user is not coming from the dashboard', () => {
    const middlewareParameters = buildMiddlewareParameters({
      reqMock: {
        originalUrl: '/companies',
      },
      locals: {
        user: {
          dit_team: {
            id: '1',
            name: 'DIT South East - International Trade Team',
            role: {
              name: 'International Trade Team',
              id: '2',
            },
          },
        },
        isFeatureTesting: true,
      },
    })

    userRole(
      middlewareParameters.reqMock,
      middlewareParameters.resMock,
      middlewareParameters.nextSpy
    )

    it('should call next() and not redirect to the dashboard "Pipeline" tab', () => {
      expect(middlewareParameters.nextSpy).to.have.been.called
      expect(middlewareParameters.resMock.redirect).not.to.have.been.called
    })
  })

  context(
    'when the user does not have the personalised dashboard feature flag"',
    () => {
      const middlewareParameters = buildMiddlewareParameters({
        locals: {
          user: {
            dit_team: {
              id: '1',
              name: 'DIT South East - International Trade Team',
              role: {
                name: 'International Trade Team',
                id: '2',
              },
            },
          },
          isFeatureTesting: false,
        },
      })

      userRole(
        middlewareParameters.reqMock,
        middlewareParameters.resMock,
        middlewareParameters.nextSpy
      )

      it('should call next() and not redirect to the dashboard "Pipeline" tab', () => {
        expect(middlewareParameters.nextSpy).to.have.been.called
        expect(middlewareParameters.resMock.redirect).not.to.have.been.called
      })
    }
  )
})
