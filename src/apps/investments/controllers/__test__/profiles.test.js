const config = require('../../../../config')
const buildMiddlewareParameters = require('../../../../../test/unit/helpers/middleware-parameters-builder')
const {
  renderProfilesView,
  fetchLargeCapitalProfilesHandler,
} = require('../profiles')

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
          { heading: 'Investments' }
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

  describe('#fetchLargeCapitalProfilesHandler', () => {
    describe('when the response is successful', () => {
      before(async () => {
        middlewareParameters = buildMiddlewareParameters({
          requestQuery: {
            page: 1,
          },
        })

        nock(config.apiRoot)
          .get(
            `/v4/large-investor-profile?limit=10&offset=0&sortby=modified_on`
          )
          .reply(200, { count: 0, results: [] })

        await fetchLargeCapitalProfilesHandler(
          middlewareParameters.reqMock,
          middlewareParameters.resMock,
          middlewareParameters.nextSpy
        )
      })

      it('should provide a json response', () => {
        expect(middlewareParameters.resMock.json).to.be.calledOnceWithExactly({
          count: 0,
          results: [],
        })
      })

      it('should not call next', () => {
        expect(middlewareParameters.nextSpy).to.not.be.called
      })
    })

    describe('when the response is unsuccessful', () => {
      before(async () => {
        middlewareParameters = buildMiddlewareParameters({
          requestQuery: {
            page: 1,
          },
        })

        nock(config.apiRoot)
          .get(
            `/v4/large-investor-profile?limit=10&offset=0&sortby=modified_on`
          )
          .reply(500)

        await fetchLargeCapitalProfilesHandler(
          middlewareParameters.reqMock,
          middlewareParameters.resMock,
          middlewareParameters.nextSpy
        )
      })

      it('should not provide a json response', () => {
        expect(middlewareParameters.resMock.json).to.not.be.called
      })

      it('should call next in the catch', () => {
        expect(middlewareParameters.nextSpy).to.be.called
      })
    })
  })
})
