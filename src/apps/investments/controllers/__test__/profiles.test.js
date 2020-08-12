const buildMiddlewareParameters = require('../../../../../test/unit/helpers/middleware-parameters-builder')
const { renderProfilesView } = require('../profiles')

describe('test profile controllers', () => {
  let middlewareParameters

  describe('#renderProfilesView', () => {
    describe('when the page renders successfully', () => {
      before(async () => {
        middlewareParameters = buildMiddlewareParameters()

        await renderProfilesView(
          middlewareParameters.reqMock,
          middlewareParameters.resMock,
          middlewareParameters.nextSpy
        )
      })

      it('should call breadcrumb with "Profiles"', () => {
        expect(middlewareParameters.resMock.breadcrumb).to.be.calledWith(
          'Profiles'
        )
      })

      it('should render', () => {
        expect(middlewareParameters.resMock.render).to.be.calledOnce
      })

      it('should render with a heading', () => {
        expect(middlewareParameters.resMock.render).to.be.calledWith(
          'investments/views/profiles',
          {
            heading: 'Investments',
          }
        )
      })

      it('should not call next', () => {
        expect(middlewareParameters.nextSpy).to.not.be.called
      })
    })

    describe('when there is an error', () => {
      before(async () => {
        middlewareParameters.resMock.render.throws()

        await renderProfilesView(
          middlewareParameters.reqMock,
          middlewareParameters.resMock,
          middlewareParameters.nextSpy
        )
      })

      it('should not call render', () => {
        expect(middlewareParameters.resMock.render).to.be.thrown
      })

      it('should call next in the catch', () => {
        expect(middlewareParameters.nextSpy).to.be.calledOnce
      })
    })
  })
})
