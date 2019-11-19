const buildMiddlewareParameters = require('../../../../../../test/unit/helpers/middleware-parameters-builder')
const { convertQueryTypes } = require('../translators')

describe('Converting query String types', () => {
  let middlewareParameters

  context('should cast the types when the values are defined', () => {
    before(() => {
      middlewareParameters = buildMiddlewareParameters({
        requestQuery: {
          from: '0',
          size: '20',
          activityTypeFilter: 'allActivity',
          showDnbHierarchy: 'false',
        },
      })

      convertQueryTypes(
        middlewareParameters.reqMock,
        middlewareParameters.resMock,
        middlewareParameters.nextSpy,
      )
    })

    it('should cast the types', () => {
      expect(middlewareParameters.reqMock.query).to.deep.equal({
        from: 0,
        size: 20,
        activityTypeFilter: 'allActivity',
        showDnbHierarchy: false,
      })
    })

    it('call next', () => {
      expect(middlewareParameters.nextSpy).to.have.been.calledOnce
    })
  })

  context('should not cast the types when the values are undefined', () => {
    before(() => {
      middlewareParameters = buildMiddlewareParameters({
        requestQuery: {
          activityTypeFilter: 'allActivity',
        },
      })

      convertQueryTypes(
        middlewareParameters.reqMock,
        middlewareParameters.resMock,
        middlewareParameters.nextSpy,
      )
    })

    it('should not cast the types', () => {
      expect(middlewareParameters.reqMock.query).to.deep.equal({
        activityTypeFilter: 'allActivity',
      })
    })

    it('call next', () => {
      expect(middlewareParameters.nextSpy).to.have.been.calledOnce
    })
  })
})
