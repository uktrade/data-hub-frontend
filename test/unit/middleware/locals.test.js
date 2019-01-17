const buildMiddlewareParameters = require('~/test/unit/helpers/middleware-parameters-builder.js')

const locals = require('~/src/middleware/locals')

describe('locals', () => {
  describe('#getBreadcrumbs', () => {
    beforeEach(() => {
      this.middlewareParameters = buildMiddlewareParameters({
        breadcrumb: sinon.stub().returns([
          {
            text: 'breadcrumb-1',
            href: '/breadcrumb-1',
          },
          {
            text: 'breadcrumb-2',
            href: '/breadcrumb-2',
          },
        ]),
      })

      locals(
        {
          get: sinon.spy(),
          path: 'path',
        },
        this.middlewareParameters.resMock,
        this.middlewareParameters.nextSpy,
      )

      this.breadcrumbs = this.middlewareParameters.resMock.locals.getBreadcrumbs()
    })

    it('should return two breadcrumbs', () => {
      expect(this.breadcrumbs.length).to.equal(2)
    })

    it('should return the first breadcrumb with a href', () => {
      expect(this.breadcrumbs[0].href).to.exist
    })

    it('should return the last breadcrumb without a href', () => {
      expect(this.breadcrumbs[1].href).to.not.exist
    })
  })
})
