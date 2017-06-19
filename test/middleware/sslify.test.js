describe('Sslify middleware', () => {
  beforeEach(() => {
    this.sslify = require('~/src/middleware/sslify')
    this.sandbox = sinon.sandbox.create()
    this.nextSpy = this.sandbox.spy()
    this.redirectSpy = this.sandbox.spy()
  })

  afterEach(() => {
    this.sandbox.restore()
  })

  describe('#setSecure', () => {
    describe('when secure is set on request object', () => {
      it('should return true', () => {
        const reqMock = { secure: true }

        this.sslify.setSecure()(reqMock, {}, this.nextSpy)

        expect(reqMock).to.have.property('isHttps')
        expect(reqMock.isHttps).to.equal(true)
        expect(this.nextSpy.calledOnce).to.be.true
      })
    })

    describe('when trustProtoHeader option is true', () => {
      describe('request header for x-forwarded-proto contains https', () => {
        it('should return true', () => {
          const reqMock = {
            secure: false,
            headers: {
              'x-forwarded-proto': 'https',
            },
          }

          this.sslify.setSecure({
            trustProtoHeader: true,
          })(reqMock, {}, this.nextSpy)

          expect(reqMock).to.have.property('isHttps')
          expect(reqMock.isHttps).to.equal(true)
          expect(this.nextSpy.calledOnce).to.be.true
        })
      })

      describe('request header for x-forwarded-proto does not contain https', () => {
        it('should return false', () => {
          const reqMock = {
            secure: false,
            headers: {
              'x-forwarded-proto': 'http',
            },
          }

          this.sslify.setSecure({
            trustProtoHeader: true,
          })(reqMock, {}, this.nextSpy)

          expect(reqMock).to.have.property('isHttps')
          expect(reqMock.isHttps).to.equal(false)
          expect(this.nextSpy.calledOnce).to.be.true
        })
      })
    })

    describe('when trustAzureHeader option is true', () => {
      describe('request headers include x-arr-ssl', () => {
        it('should return true', () => {
          const reqMock = {
            secure: false,
            headers: {
              'x-arr-ssl': true,
            },
          }

          this.sslify.setSecure({
            trustAzureHeader: true,
          })(reqMock, {}, this.nextSpy)

          expect(reqMock).to.have.property('isHttps')
          expect(reqMock.isHttps).to.equal(true)
          expect(this.nextSpy.calledOnce).to.be.true
        })
      })

      describe('request headers does not include x-arr-ssl', () => {
        it('should return false', () => {
          const reqMock = {
            secure: false,
            headers: {},
          }

          this.sslify.setSecure({
            trustAzureHeader: true,
          })(reqMock, {}, this.nextSpy)

          expect(reqMock).to.have.property('isHttps')
          expect(reqMock.isHttps).to.equal(false)
          expect(this.nextSpy.calledOnce).to.be.true
        })
      })
    })
  })

  describe('#enforceHTTPS', () => {
    describe('when request is secure', () => {
      it('should call next middleware', () => {
        const reqMock = { secure: true }

        this.sslify.enforceHTTPS()(reqMock, {}, this.nextSpy)

        expect(this.nextSpy.calledOnce).to.be.true
      })
    })

    describe('when request is not secure', () => {
      beforeEach(() => {
        this.host = 'normal-host.com'
        this.forwardedHost = 'forwarded-host.com'
        this.originalPath = '/original-path'
        this.reqMock = {
          secure: false,
          headers: {
            host: this.host,
            'x-forwarded-host': this.forwardedHost,
          },
          originalUrl: this.originalUrl,
        }
        this.resMock = {
          redirect: this.redirectSpy,
        }
      })

      describe('when request method is GET', () => {
        it('should redirect correctly', () => {
          this.reqMock.method = 'GET'

          this.sslify.enforceHTTPS()(this.reqMock, this.resMock, this.nextSpy)

          expect(this.redirectSpy).to.be.calledWith(301, `https://${this.host}${this.originalUrl}`)
          expect(this.nextSpy).not.to.be.called
        })
      })

      describe('when request method is HEAD', () => {
        it('should redirect correctly', () => {
          this.reqMock.method = 'GET'

          this.sslify.enforceHTTPS()(this.reqMock, this.resMock, this.nextSpy)

          expect(this.redirectSpy).to.be.calledWith(301, `https://${this.host}${this.originalUrl}`)
          expect(this.nextSpy).not.to.be.called
        })
      })

      describe('when trustXForwardedHostHeader is true', () => {
        it('should use the forwarded host header', () => {
          this.reqMock.method = 'GET'

          this.sslify.enforceHTTPS({
            trustXForwardedHostHeader: true,
          })(this.reqMock, this.resMock, this.nextSpy)

          expect(this.redirectSpy).to.be.calledWith(301, `https://${this.forwardedHost}${this.originalUrl}`)
          expect(this.nextSpy).not.to.be.called
        })
      })

      describe('when request method is POST', () => {
        beforeEach(() => {
          this.reqMock.method = 'POST'
        })

        it('should set a 403 error', () => {
          this.resMock.send = this.sandbox.spy()
          this.resMock.status = function status (responseStatus) {
            expect(responseStatus).to.equal(403)
            return this
          }

          this.sslify.enforceHTTPS()(this.reqMock, this.resMock, this.nextSpy)
        })

        it('should send an error string', () => {
          this.resMock.send = this.sandbox.stub()
          this.resMock.status = function status () {
            return this
          }

          this.sslify.enforceHTTPS()(this.reqMock, this.resMock, this.nextSpy)

          expect(this.resMock.send).to.be.calledWith('Please use HTTPS when submitting data to this server.')
        })
      })
    })
  })
})
