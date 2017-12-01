const nock = require('nock')
const queryString = require('query-string')
const { assign, set } = require('lodash')

describe('OAuth controller', () => {
  beforeEach(() => {
    this.sandbox = sinon.sandbox.create()
    this.mockUuid = this.sandbox.stub()
    this.mockConfig = {}
    this.controller = proxyquire.noCallThru().load('~/src/apps/oauth/controllers', {
      './../../../config': this.mockConfig,
      'uuid': this.mockUuid,
    })
    this.resMock = assign({}, globalRes, {
      redirect: this.sandbox.spy(),
      render: this.sandbox.spy(),
      clearCookie: this.sandbox.spy(),
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
    context('with the state query param in the url', () => {
      const mockState = 'mock-state-id'

      it('should throw an error with state mismatch', () => {
        set(this.reqMock, 'query.state', mockState)
        set(this.reqMock, 'session.oauth.state', 'non-matching-state-id')

        this.controller.callbackOAuth(this.reqMock, this.resMock, this.nextSpy)
        expect(this.nextSpy.calledOnce).to.be.true
        expect(this.nextSpy.args[0][0] instanceof Error).to.be.true
        expect(this.nextSpy.args[0][0].message).to.equal('There has been an OAuth stateId mismatch')
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

        this.nockScope = nock(mockFetchUrl.host)
          .post(mockFetchUrl.path)
          .reply(200, { access_token: mockOauthAccessToken })

        await this.controller.callbackOAuth(this.reqMock, this.resMock, this.nextSpy)

        expect(this.resMock.redirect).to.have.been.calledOnce
        expect(this.resMock.redirect.args[0][0]).to.equal('/')
        expect(this.reqMock.session.token).to.equal(mockOauthAccessToken)
      })

      it('nock mocked scope has been called', async () => {
        await this.controller.callbackOAuth(this.reqMock, this.resMock, this.nextSpy)
        expect(this.nockScope.isDone()).to.be.true
      })
    })

    context('when there is an error query param', () => {
      it('should show help page', () => {
        const helpPageTitle = 'You don\'t have permission to access this service'
        const mockError = 'invalid_scope'

        set(this.reqMock, 'query.error', mockError)
        this.controller.callbackOAuth(this.reqMock, this.resMock, this.nextSpy)

        expect(this.resMock.render).to.have.been.calledWith('oauth/views/help-page', sinon.match({
          heading: helpPageTitle,
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
        this.nockScope = nock(mockFetchUrl.host)
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

        this.nockScope = nock(mockFetchUrl.host)
          .post(mockFetchUrl.path)
          .reply(200, { access_token: mockOauthAccessToken })

        await this.controller.callbackOAuth(this.reqMock, this.resMock, this.nextSpy)

        expect(this.resMock.redirect).to.have.been.calledOnce
        expect(this.resMock.redirect.args[0][0]).to.equal(returnToUrl)
        expect(this.reqMock.session.token).to.equal(mockOauthAccessToken)
      })

      it('should handle error as expected', async () => {
        const returnedError = 'terrible things happen in the upside down'

        this.nockScope = nock(mockFetchUrl.host)
          .post(mockFetchUrl.path)
          .replyWithError(returnedError)

        await this.controller.callbackOAuth(this.reqMock, this.resMock, this.nextSpy)

        expect(this.nextSpy).to.have.been.calledOnce
        expect(this.nextSpy.args[0][0].message).to.equal(`Error: ${returnedError}`)
        expect(this.reqMock.session.token).to.be.undefined
      })

      it('nock mocked scope has been called', async () => {
        await this.controller.callbackOAuth(this.reqMock, this.resMock, this.nextSpy)
        expect(this.nockScope.isDone()).to.be.true
      })
    })
  })

  describe('#signOutOAuth', () => {
    beforeEach(() => {
      this.mockOauthConfig = {
        logoutUrl: 'https://logout-url',
      }

      set(this.mockConfig, 'oauth', this.mockOauthConfig)
      set(this.reqMock.session, {
        user: {
          name: 'Barry',
        },
        returnTo: '/path',
        token: 'abcd',
      })

      this.controller.signOutOAuth(this.reqMock, this.resMock, this.nextSpy)
    })

    it('should reset session properties', () => {
      expect(this.reqMock.session).to.be.null
    })

    it('should clear the cookie', () => {
      expect(this.resMock.clearCookie).to.be.calledWith('datahub.sid')
      expect(this.resMock.clearCookie).to.be.calledOnce
    })

    it('should redirect', () => {
      expect(this.resMock.redirect).to.be.calledWith(this.mockOauthConfig.logoutUrl)
    })
  })
})
