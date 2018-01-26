const queryString = require('query-string')
const { assign, set } = require('lodash')

describe('OAuth controller', () => {
  beforeEach(() => {
    this.mockUuid = sandbox.stub().returns(this.mockUUIDvalue)
    this.mockConfig = {}
    this.controller = proxyquire.noCallThru().load('~/src/apps/oauth/controllers', {
      './../../../config': this.mockConfig,
      'uuid': this.mockUuid,
    })
    this.resMock = assign({}, globalRes, {
      redirect: sandbox.spy(),
      render: sandbox.spy(),
      clearCookie: sandbox.spy(),
    })
    this.reqMock = assign({}, globalReq, {
      session: {},
    })
    this.nextSpy = sandbox.spy()
  })

  describe('#redirectOAuth', () => {
    context('without oauth.devToken', () => {
      beforeEach(() => {
        this.mockUUIDvalue = 'mock-uuid-1234'
        this.mockOauthConfig = {
          clientId: 'mockClientId',
          redirectUri: 'mockRedirectUri',
          url: 'mockOauthUrl',
        }
        this.expectedOauthRedirectUrl = queryString.stringify({
          response_type: 'code',
          client_id: this.mockOauthConfig.clientId,
          redirect_uri: this.mockOauthConfig.redirectUri,
          state: this.mockUUIDvalue,
          idp: 'cirrus',
        })

        set(this.mockConfig, 'oauth', this.mockOauthConfig)
        this.controller.redirectOAuth(this.reqMock, this.resMock, this.nextSpy)
      })

      it('should redirect', () => {
        expect(this.resMock.redirect).to.have.been.calledOnce
      })

      it('should redirect to the correct Oauth url', () => {
        expect(this.resMock.redirect).to.be.calledWith(`${this.mockOauthConfig.url}?${this.expectedOauthRedirectUrl}`)
      })

      it('session should hold correct UUID', () => {
        expect(this.reqMock.session.oauth.state).to.equal(this.mockUUIDvalue)
      })
    })

    context('with oauth.devToken', () => {
      beforeEach(() => {
        this.mockUUIDvalue = 'mock-uuid-1234'
        this.mockDevToken = 'robo-cat-developer'
        this.mockOauthConfig = {
          clientId: 'mockClientId',
          redirectUri: 'mockRedirectUri',
          url: 'mockOauthUrl',
          devToken: this.mockDevToken,
        }
        this.expectedOauthRedirectUrl = queryString.stringify({
          response_type: 'code',
          client_id: this.mockOauthConfig.clientId,
          redirect_uri: this.mockOauthConfig.redirectUri,
          state: this.mockUUIDvalue,
          idp: 'cirrus',
          code: this.mockDevToken,
        })

        set(this.mockConfig, 'oauth', this.mockOauthConfig)
        this.controller.redirectOAuth(this.reqMock, this.resMock, this.nextSpy)
      })

      it('should redirect', () => {
        expect(this.resMock.redirect).to.have.been.calledOnce
      })

      it('should redirect to the correct Oauth url', () => {
        expect(this.resMock.redirect).to.be.calledWith(`${this.mockOauthConfig.url}?${this.expectedOauthRedirectUrl}`)
      })

      it('session should hold correct UUID', () => {
        expect(this.reqMock.session.oauth.state).to.equal(this.mockUUIDvalue)
      })
    })
  })

  describe('#callbackOAuth', () => {
    context('with the state query param in the url', () => {
      beforeEach(() => {
        this.mockStateId = 'mock-state-id'
      })

      context('and a state mismatch', () => {
        beforeEach(() => {
          set(this.reqMock, 'query.state', this.mockStateId)
          set(this.reqMock, 'session.oauth.state', 'non-matching-state-id')

          this.controller.callbackOAuth(this.reqMock, this.resMock, this.nextSpy)
        })

        it('should call next', () => {
          expect(this.nextSpy.calledOnce).to.be.true
        })

        it('should throw an error', () => {
          expect(this.nextSpy.args[0][0] instanceof Error).to.be.true
        })

        it('should have expected error message', () => {
          expect(this.nextSpy.args[0][0].message).to.have.string('There has been an OAuth stateId mismatch')
        })
      })

      context('and state values match', () => {
        beforeEach(async () => {
          this.mockOauthAccessToken = 'mockAccessToken'
          this.mockAuthCode = 'mock-auth-code'
          this.mockFetchUrl = {
            host: 'http://mock-oauth-host',
            path: '/example-fetch-token-url',
          }

          set(this.mockConfig, 'oauth', {
            tokenFetchUrl: this.mockFetchUrl.host + this.mockFetchUrl.path,
            clientSecret: 'mock-client-secret',
            redirectUri: '/mock/callback/url',
            clientId: 'mockClientId',
          })
          set(this.reqMock, 'query', {
            state: this.mockState,
            code: this.mockAuthCode,
          })
          set(this.reqMock, 'session.oauth.state', this.mockState)

          this.nockScope = nock(this.mockFetchUrl.host)
            .post(this.mockFetchUrl.path)
            .reply(200, { access_token: this.mockOauthAccessToken })

          await this.controller.callbackOAuth(this.reqMock, this.resMock, this.nextSpy)
        })

        it('should redirect', () => {
          expect(this.resMock.redirect).to.have.been.calledOnce
        })

        it('should redirect to expected location', () => {
          expect(this.resMock.redirect.args[0][0]).to.equal('/')
        })

        it('token should match expected value', () => {
          expect(this.reqMock.session.token).to.equal(this.mockOauthAccessToken)
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
    })

    describe('#getAccessToken', () => {
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

      context('redirect to root', () => {
        beforeEach(async () => {
          this.nockScope = nock(mockFetchUrl.host)
            .post(mockFetchUrl.path)
            .reply(200, { access_token: mockOauthAccessToken })
          await this.controller.callbackOAuth(this.reqMock, this.resMock, this.nextSpy)
        })

        it('should show redirect to root page url', () => {
          expect(this.resMock.redirect).to.have.been.calledOnce
          expect(this.resMock.redirect.args[0][0]).to.equal('/')
          expect(this.reqMock.session.token).to.equal(mockOauthAccessToken)
        })
      })

      context('redirect to returnTo', () => {
        const returnToUrl = 'return/to/url'

        beforeEach(async () => {
          set(this.reqMock, 'session.returnTo', returnToUrl)

          this.nockScope = nock(mockFetchUrl.host)
            .post(mockFetchUrl.path)
            .reply(200, { access_token: mockOauthAccessToken })

          await this.controller.callbackOAuth(this.reqMock, this.resMock, this.nextSpy)
        })

        it('should show redirect to returnTo url', () => {
          expect(this.resMock.redirect).to.have.been.calledOnce
          expect(this.resMock.redirect.args[0][0]).to.equal(returnToUrl)
          expect(this.reqMock.session.token).to.equal(mockOauthAccessToken)
        })
      })

      context('redirect to returnTo', () => {
        const returnedError = 'terrible things happen in the upside down'

        beforeEach(async () => {
          this.nockScope = nock(mockFetchUrl.host)
            .post(mockFetchUrl.path)
            .replyWithError(returnedError)

          await this.controller.callbackOAuth(this.reqMock, this.resMock, this.nextSpy)
        })

        it('should handle error as expected', async () => {
          expect(this.nextSpy).to.have.been.calledOnce
          expect(this.nextSpy.args[0][0].message).to.equal(`Error: ${returnedError}`)
          expect(this.reqMock.session.token).to.be.undefined
        })
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
