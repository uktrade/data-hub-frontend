const buildMiddlewareParameters = require('../../../test/unit/helpers/middleware-parameters-builder')
const locals = require('../locals')

describe('locals', () => {
  it('should set local variables', () => {
    const middlewareParameters = buildMiddlewareParameters({
      reqMock: {
        encrypted: true,
        xhr: false,
        get: sinon.stub().returns('example.com'),
        originalUrl: '/some-org-url',
      },
      requestPath: '/some-path',
      requestQuery: '?page=1',
    })

    locals(
      middlewareParameters.reqMock,
      middlewareParameters.resMock,
      middlewareParameters.nextSpy,
    )

    const {
      APP_VERSION,
      BASE_URL,
      CANONICAL_URL,
      ORIGINAL_URL,
      CURRENT_PATH,
      IS_XHR,
      QUERY,
    } = middlewareParameters.resMock.locals

    expect(APP_VERSION).to.equal('unknown')
    expect(BASE_URL).to.equal('https://example.com')
    expect(CANONICAL_URL).to.equal('https://example.com/some-path')
    expect(ORIGINAL_URL).to.equal('https://example.com/some-org-url')
    expect(CURRENT_PATH).to.equal('/some-path')
    expect(IS_XHR).to.equal(false)
    expect(QUERY).to.equal('?page=1')
  })

  it('getBreadcrumbs() should return breadcrumbs', () => {
    const middlewareParameters = buildMiddlewareParameters({
      reqMock: {
        get: sinon.spy(),
        path: 'path',
      },
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
      middlewareParameters.reqMock,
      middlewareParameters.resMock,
      middlewareParameters.nextSpy,
    )

    const breadcrumbs = middlewareParameters.resMock.locals.getBreadcrumbs()

    expect(breadcrumbs).to.deep.equal([
      {
        'href': '/breadcrumb-1',
        'text': 'breadcrumb-1',
      },
      {
        'href': null,
        'text': 'breadcrumb-2',
      },
    ])
  })
})
