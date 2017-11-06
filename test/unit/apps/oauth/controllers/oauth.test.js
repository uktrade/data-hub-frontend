const nock = require('nock')
const queryString = require('query-string')
const { assign, set } = require('lodash')

describe('OAuth controller', () => {
  beforeEach(() => {
    this.sandbox = sinon.sandbox.create()
    this.mockUuid = this.sandbox.stub()
    this.mockConfig = {}
    this.breadcrumbSpy = this.sandbox.stub().returnsThis()
    this.controller = proxyquire.noCallThru().load('~/src/apps/oauth/controllers', {
      './../../../config': this.mockConfig,
      'uuid': this.mockUuid,
    })
    this.resMock = assign({}, globalRes, {
      redirect: this.sandbox.spy(),
      breadcrumb: this.breadcrumbSpy,
      render: this.sandbox.spy(),
    })
    this.reqMock = assign({}, globalReq, {
      session: {},
    })
    this.nextSpy = this.sandbox.spy()
  })

  afterEach(() => {
    this.sandbox.restore()
  })

  describe('#redirectOAuth', () => {
    it('should redirect to the correct Oauth url', () => {
      const mockUUID = 'mock-uuid-1234'
      const mockOauthConfig = {
        clientId: 'mockClientId',
        redirectUri: 'mockRedirectUri',
        url: 'mockOauthUrl',
      }
      const expectedOauthRedirectUrl = queryString.stringify({
        response_type: 'code',
        client_id: mockOauthConfig.clientId,
        redirect_uri: mockOauthConfig.redirectUri,
        state: mockUUID,
        idp: 'cirrus',
      })

      this.mockUuid.returns(mockUUID)
      set(this.mockConfig, 'oauth', mockOauthConfig)

      this.controller.redirectOAuth(this.reqMock, this.resMock, this.nextSpy)

      expect(this.resMock.redirect).to.be.calledWith(`${mockOauthConfig.url}?${expectedOauthRedirectUrl}`)
      expect(this.resMock.redirect).to.have.been.calledOnce
      expect(this.reqMock.session.oauth.state).to.equal(mockUUID)
    })
  })

  describe('#callbackOAuth', () => {
    const helpPageTitle = 'Contact Live Services'

    context('when there is a state query param', () => {
      const mockState = 'mock-state-d'

      it('should show error with state mismatch', () => {
        set(this.reqMock, 'query.state', mockState)
        set(this.reqMock, 'session.oauth.state', 'non-matching-state-id')

        this.controller.callbackOAuth(this.reqMock, this.resMock, this.nextSpy)

        expect(this.resMock.breadcrumb).to.have.been.calledWith(helpPageTitle)
        expect(this.resMock.render).to.have.been.calledWith('oauth/views/help-page', sinon.match({
          heading: helpPageTitle,
          errorCode: 'state_mismatch',
          errorMessage: 'State mismatch',
        }))
      })

      it('should proceed when state values match', async () => {
        const mockOauthAccessToken = 'mockAccessToken'
        const mockAuthCode = 'mock-auth-code'
        const mockFetchUrl = {
          host: 'http://mock-oauth-host',
          path: '/example-fetch-token-url',
        }

        set(this.mockConfig, 'oauth', {
          tokenFetchUrl: mockFetchUrl.host + mockFetchUrl.path,
          clientSecret: 'mock-client-secret',
          redirectUri: '/mock/callback/url',
          clientId: 'mockClientId',
        })
        set(this.reqMock, 'query', {
          state: mockState,
          code: mockAuthCode,
        })
        set(this.reqMock, 'session.oauth.state', mockState)

        nock(mockFetchUrl.host)
          .post(mockFetchUrl.path)
          .reply(200, { access_token: mockOauthAccessToken })

        await this.controller.callbackOAuth(this.reqMock, this.resMock, this.nextSpy)

        expect(this.resMock.redirect).to.have.been.calledOnce
        expect(this.resMock.redirect.args[0][0]).to.equal('/')
        expect(this.reqMock.session.token).to.equal(mockOauthAccessToken)
      })
    })

    context('when there is an error query param', () => {
      it('should show "Invalid scope" error', () => {
        const mockError = 'invalid_scope'

        set(this.reqMock, 'query.error', mockError)
        this.controller.callbackOAuth(this.reqMock, this.resMock, this.nextSpy)

        expect(this.resMock.breadcrumb).to.have.been.calledWith(helpPageTitle)
        expect(this.resMock.render).to.have.been.calledWith('oauth/views/help-page', sinon.match({
          heading: helpPageTitle,
          errorCode: mockError,
          errorMessage: 'Invalid scope',
        }))
      })

      it('should show "Access denied" error', () => {
        const mockError = 'access-denied'

        set(this.reqMock, 'query.error', mockError)
        this.controller.callbackOAuth(this.reqMock, this.resMock, this.nextSpy)

        expect(this.resMock.breadcrumb).to.have.been.calledWith(helpPageTitle)
        expect(this.resMock.render).to.have.been.calledWith('oauth/views/help-page', sinon.match({
          heading: helpPageTitle,
          errorCode: mockError,
          errorMessage: 'Access denied',
        }))
      })

      it('should show help page without matching code error', () => {
        const mockError = 'random-code'

        set(this.reqMock, 'query.error', mockError)
        this.controller.callbackOAuth(this.reqMock, this.resMock, this.nextSpy)

        expect(this.resMock.breadcrumb).to.have.been.calledWith(helpPageTitle)
        expect(this.resMock.render).to.have.been.calledWith('oauth/views/help-page', sinon.match({
          heading: helpPageTitle,
          errorCode: mockError,
          errorMessage: undefined,
        }))
      })
    })

    describe('#getBearerToken', () => {
      const mockOauthAccessToken = 'mockAccessToken'
      const mockState = 'mock-state-id'
      const mockAuthCode = 'mock-auth-code'
      const mockFetchUrl = {
        host: 'http://mock-oauth-host',
        path: '/example-fetch-token-url',
      }

      beforeEach(() => {
        set(this.mockConfig, 'oauth', {
          tokenFetchUrl: mockFetchUrl.host + mockFetchUrl.path,
          clientSecret: 'mock-client-secret',
          redirectUri: '/mock/callback/url',
          clientId: 'mockClientId',
        })
        set(this.reqMock, 'query', {
          state: mockState,
          code: mockAuthCode,
        })
        set(this.reqMock, 'session.oauth.state', mockState)
      })

      it('should show redirect to root page url', async () => {
        nock(mockFetchUrl.host)
          .post(mockFetchUrl.path)
          .reply(200, { access_token: mockOauthAccessToken })

        await this.controller.callbackOAuth(this.reqMock, this.resMock, this.nextSpy)

        expect(this.resMock.redirect).to.have.been.calledOnce
        expect(this.resMock.redirect.args[0][0]).to.equal('/')
        expect(this.reqMock.session.token).to.equal(mockOauthAccessToken)
      })

      it('should show redirect to returnTo url', async () => {
        const returnToUrl = 'return/to/url'
        set(this.reqMock, 'session.returnTo', returnToUrl)

        nock(mockFetchUrl.host)
          .post(mockFetchUrl.path)
          .reply(200, { access_token: mockOauthAccessToken })

        await this.controller.callbackOAuth(this.reqMock, this.resMock, this.nextSpy)

        expect(this.resMock.redirect).to.have.been.calledOnce
        expect(this.resMock.redirect.args[0][0]).to.equal(returnToUrl)
        expect(this.reqMock.session.token).to.equal(mockOauthAccessToken)
      })

      it('should handle error as expected', async () => {
        const returnedError = 'terrible things happen in the upside down'

        nock(mockFetchUrl.host)
          .post(mockFetchUrl.path)
          .replyWithError(returnedError)

        await this.controller.callbackOAuth(this.reqMock, this.resMock, this.nextSpy)

        expect(this.nextSpy).to.have.been.calledOnce
        expect(this.nextSpy.args[0][0].message).to.equal(`Error: ${returnedError}`)
        expect(this.reqMock.session.token).to.be.undefined
      })
    })
  })
})
