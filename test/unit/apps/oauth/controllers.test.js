const queryString = require('query-string')
const { assign, set } = require('lodash')

const sessionHelper = require('~/src/lib/session-helper')

describe('OAuth controller', () => {
  beforeEach(() => {
    this.mockUuid = sandbox.stub().returns(this.mockUUIDvalue)
    this.mockConfig = {}
    this.reloadSessionStub = sandbox.stub(sessionHelper, 'reloadSession')
    this.controller = proxyquire.noCallThru().load('~/src/apps/oauth/controllers', {
      './../../../config': this.mockConfig,
      'uuid': this.mockUuid,
      './../../lib/session-helper': {
        reloadSession: this.reloadSessionStub,
      },
    })
    this.mockOauthAccessToken = 'mockAccessToken'
    this.mockAuthCode = 'mock-auth-code'
    this.mockFetchUrl = {
      host: 'http://mock-oauth-host',
      path: '/example-fetch-token-url',
    }
    this.mockStateId = 'mock-state-id'

    this.resMock = assign({}, globalRes, {
      redirect: sandbox.spy(),
      render: sandbox.spy(),
      clearCookie: sandbox.spy(),
    })
    this.reqMock = assign({}, globalReq, {
      session: {},
    })
    this.nextSpy = sandbox.spy()

    this.mockConfig.oauth = {
      tokenFetchUrl: this.mockFetchUrl.host + this.mockFetchUrl.path,
      clientSecret: 'mock-client-secret',
      redirectUri: '/mock/callback/url',
      clientId: 'mockClientId',
    }
  })

  describe('#redirectOAuth', () => {
    beforeEach(() => {
      this.mockUUIDvalue = 'mock-uuid-1234'
    })

    context('without oauth.devToken', () => {
      beforeEach(() => {
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
        this.mockDevToken = 'robo-cat-developer'
        this.mockOauthConfig.devToken = this.mockDevToken
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
      context('an "undefined" oauth state in the session', () => {
        beforeEach(() => {
          set(this.reqMock, 'query', {
            state: this.mockStateId,
            code: this.mockAuthCode,
          })
          set(this.reqMock, 'session.oauth.state', undefined)

          nock(this.mockFetchUrl.host)
            .post(this.mockFetchUrl.path)
            .reply(200, { access_token: this.mockOauthAccessToken })
        })

        context('reload session resolves', () => {
          beforeEach(async () => {
            this.reloadSessionStub.resolves().callsFake(() => {
              set(this.reqMock, 'session.oauth.state', this.mockStateId)
            })

            await this.controller.callbackOAuth(this.reqMock, this.resMock, this.nextSpy)
          })

          it('should call reloadSession', () => {
            expect(this.reloadSessionStub).to.have.been.calledOnce
          })

          it('should complete the callbackOAuth call', () => {
            expect(this.resMock.redirect).to.have.been.calledOnce
            expect(this.resMock.redirect).to.have.been.calledWith('/')
          })

          it('token should match expected value', () => {
            expect(this.reqMock.session.token).to.equal(this.mockOauthAccessToken)
          })
        })

        context('reload session rejects', () => {
          beforeEach(async () => {
            this.returnedError = 'oh no!'
            this.reloadSessionStub.rejects(this.returnedError)

            await this.controller.callbackOAuth(this.reqMock, this.resMock, this.nextSpy)
          })

          it('should call reloadSession', () => {
            expect(this.reloadSessionStub).to.have.been.calledOnce
          })

          it('should handle error as expected', () => {
            expect(this.nextSpy).to.have.been.calledOnce
            expect(this.nextSpy.args[0][0].name).to.equal(this.returnedError)
          })

          it('token should be undefined', () => {
            expect(this.reqMock.session.token).to.be.undefined
          })
        })
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

        it('token should be undefined', () => {
          expect(this.reqMock.session.token).to.be.undefined
        })
      })

      context('and state values match', () => {
        beforeEach(async () => {
          this.reqMock.query = {
            state: this.mockStateId,
            code: this.mockAuthCode,
          }
          set(this.reqMock, 'session.oauth.state', this.mockStateId)

          nock(this.mockFetchUrl.host)
            .post(this.mockFetchUrl.path)
            .reply(200, { access_token: this.mockOauthAccessToken })

          await this.controller.callbackOAuth(this.reqMock, this.resMock, this.nextSpy)
        })

        it('should redirect', () => {
          expect(this.resMock.redirect).to.have.been.calledOnce
        })

        it('should redirect to expected location', () => {
          expect(this.resMock.redirect).to.have.been.calledWith('/')
        })

        it('token should match expected value', () => {
          expect(this.reqMock.session.token).to.equal(this.mockOauthAccessToken)
        })
      })

      context('when there is an error query param', () => {
        it('should show help page', () => {
          this.helpPageTitle = 'You don\'t have permission to access this service'
          this.mockError = 'invalid_scope'

          set(this.reqMock, 'query.error', this.mockError)
          this.controller.callbackOAuth(this.reqMock, this.resMock, this.nextSpy)

          expect(this.resMock.render).to.have.been.calledWith('oauth/views/help-page', sinon.match({
            heading: this.helpPageTitle,
          }))

          it('token should be undefined', () => {
            expect(this.reqMock.session.token).to.be.undefined
          })
        })
      })
    })

    describe('#getAccessToken', () => {
      beforeEach(() => {
        this.reqMock.query = {
          state: this.mockStateId,
          code: this.mockAuthCode,
        }
        set(this.reqMock, 'session.oauth.state', this.mockStateId)
      })

      context('redirect to root', () => {
        beforeEach(async () => {
          nock(this.mockFetchUrl.host)
            .post(this.mockFetchUrl.path)
            .reply(200, { access_token: this.mockOauthAccessToken })

          await this.controller.callbackOAuth(this.reqMock, this.resMock, this.nextSpy)
        })

        it('should call redirect', () => {
          expect(this.resMock.redirect).to.have.been.calledOnce
        })

        it('should redirect to expected location', () => {
          expect(this.resMock.redirect).to.have.been.calledWith('/')
        })

        it('token should match expected value', () => {
          expect(this.reqMock.session.token).to.equal(this.mockOauthAccessToken)
        })
      })

      context('redirect to returnTo', () => {
        this.returnToUrl = 'return/to/url'

        beforeEach(async () => {
          set(this.reqMock, 'session.returnTo', this.returnToUrl)

          nock(this.mockFetchUrl.host)
            .post(this.mockFetchUrl.path)
            .reply(200, { access_token: this.mockOauthAccessToken })

          await this.controller.callbackOAuth(this.reqMock, this.resMock, this.nextSpy)
        })

        it('should call redirect', () => {
          expect(this.resMock.redirect).to.have.been.calledOnce
        })

        it('should redirect to expected location', () => {
          expect(this.resMock.redirect).to.have.been.calledWith(this.returnToUrl)
        })

        it('token should match expected value', () => {
          expect(this.reqMock.session.token).to.equal(this.mockOauthAccessToken)
        })
      })

      context('handle error', () => {
        this.returnedError = 'terrible things happen in the upside down'

        beforeEach(async () => {
          nock(this.mockFetchUrl.host)
            .post(this.mockFetchUrl.path)
            .replyWithError(this.returnedError)

          await this.controller.callbackOAuth(this.reqMock, this.resMock, this.nextSpy)
        })

        it('should handle error as expected', () => {
          expect(this.nextSpy).to.have.been.calledOnce
          expect(this.nextSpy.args[0][0].message).to.equal(`Error: ${this.returnedError}`)
        })

        it('token should be undefined', () => {
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
