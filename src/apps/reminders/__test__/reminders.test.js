const buildMiddlewareParameters = require('../../../../test/unit/helpers/middleware-parameters-builder')
const controller = require('../controller')
const urls = require('../../../lib/urls')

describe('Reminders redirected routes', () => {
  context(
    'Redirecting the user to /reminders/investments-estimated-land-dates',
    () => {
      const middlewareParameters = buildMiddlewareParameters()

      controller.redirectEstimatedLandDate(
        middlewareParameters.reqMock,
        middlewareParameters.resMock
      )

      it('should redirect', () => {
        expect(middlewareParameters.resMock.redirect).calledOnceWithExactly(
          urls.reminders.investments.estimatedLandDate()
        )
      })
    }
  )

  context(
    'Redirecting the user to /reminders/investments-no-recent-interactions',
    () => {
      const middlewareParameters = buildMiddlewareParameters()

      controller.redirectNoRecentInteraction(
        middlewareParameters.reqMock,
        middlewareParameters.resMock
      )

      it('should redirect', () => {
        expect(middlewareParameters.resMock.redirect).calledOnceWithExactly(
          urls.reminders.investments.noRecentInteraction()
        )
      })
    }
  )

  context(
    'Redirecting the user to /reminders/investments-outstanding-propositions',
    () => {
      const middlewareParameters = buildMiddlewareParameters()

      controller.redirectOutstandingPropositions(
        middlewareParameters.reqMock,
        middlewareParameters.resMock
      )

      it('should redirect', () => {
        expect(middlewareParameters.resMock.redirect).calledOnceWithExactly(
          urls.reminders.investments.outstandingPropositions()
        )
      })
    }
  )

  context(
    'Redirecting the user to /reminders/settings/investments-estimated-land-dates',
    () => {
      const middlewareParameters = buildMiddlewareParameters()

      controller.redirectEstimatedLandDateSettings(
        middlewareParameters.reqMock,
        middlewareParameters.resMock
      )

      it('should redirect', () => {
        expect(middlewareParameters.resMock.redirect).calledOnceWithExactly(
          urls.reminders.settings.investments.estimatedLandDate()
        )
      })
    }
  )

  context(
    'Redirecting the user to /reminders/settings/investments-no-recent-interactions',
    () => {
      const middlewareParameters = buildMiddlewareParameters()

      controller.redirectNoRecentInteractionSettings(
        middlewareParameters.reqMock,
        middlewareParameters.resMock
      )

      it('should redirect', () => {
        expect(middlewareParameters.resMock.redirect).calledOnceWithExactly(
          urls.reminders.settings.investments.noRecentInteraction()
        )
      })
    }
  )
})
