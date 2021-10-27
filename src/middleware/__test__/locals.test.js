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
      middlewareParameters.nextSpy
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
      middlewareParameters.nextSpy
    )

    const breadcrumbs = middlewareParameters.resMock.locals.getBreadcrumbs()

    expect(breadcrumbs).to.deep.equal([
      {
        href: '/breadcrumb-1',
        text: 'breadcrumb-1',
      },
      {
        href: null,
        text: 'breadcrumb-2',
      },
    ])
  })

  it('getGoogleTagManagerPageTitle() should return the page title for GTM (level 1)', () => {
    const middlewareParameters = buildMiddlewareParameters({
      reqMock: {
        get: sinon.spy(),
        originalUrl: '/interactions/5befd870-c5f6-425a-bbce-ccc9b8c73781',
      },
    })

    locals(
      middlewareParameters.reqMock,
      middlewareParameters.resMock,
      middlewareParameters.nextSpy
    )

    const extractedPageTitle =
      middlewareParameters.resMock.locals.getGoogleTagManagerPageTitle()

    expect(extractedPageTitle).to.deep.equal('Interactions - DIT Data Hub')
  })

  it('getGoogleTagManagerPageTitle() should return the page title for GTM (level 2)', () => {
    const middlewareParameters = buildMiddlewareParameters({
      reqMock: {
        get: sinon.spy(),
        originalUrl: '/companies/ac03ea1f-9d4c-4969-9ffe-4f0e80c1d91f/activity',
      },
    })

    locals(
      middlewareParameters.reqMock,
      middlewareParameters.resMock,
      middlewareParameters.nextSpy
    )

    const extractedPageTitle =
      middlewareParameters.resMock.locals.getGoogleTagManagerPageTitle()

    expect(extractedPageTitle).to.deep.equal(
      'Companies - Activity - DIT Data Hub'
    )
  })

  it('getGoogleTagManagerPageTitle() should return the page title for GTM (level 3)', () => {
    const middlewareParameters = buildMiddlewareParameters({
      reqMock: {
        get: sinon.spy(),
        originalUrl:
          '/investments/opportunities/a84f8405-c419-40a6-84c8-642b7c3209b2/interactions',
      },
    })

    locals(
      middlewareParameters.reqMock,
      middlewareParameters.resMock,
      middlewareParameters.nextSpy
    )

    const extractedPageTitle =
      middlewareParameters.resMock.locals.getGoogleTagManagerPageTitle()

    expect(extractedPageTitle).to.deep.equal(
      'Investments - Opportunities - Interactions - DIT Data Hub'
    )
  })
})
