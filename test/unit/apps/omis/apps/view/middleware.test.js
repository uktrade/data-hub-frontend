describe('OMIS View middleware', () => {
  beforeEach(() => {
    this.sandbox = sinon.sandbox.create()

    this.setHomeBreadcrumbReturnSpy = this.sandbox.spy()
    this.setHomeBreadcrumbStub = this.sandbox.stub().returns(this.setHomeBreadcrumbReturnSpy)
    this.getQuoteStub = this.sandbox.stub()

    this.resMock = {
      locals: {
        order: {
          id: '123456789',
          reference: '12345/AS',
        },
      },
    }

    this.middleware = proxyquire('~/src/apps/omis/apps/view/middleware', {
      '../../../middleware': {
        setHomeBreadcrumb: this.setHomeBreadcrumbStub,
      },
      '../../models': {
        Order: {
          getQuote: this.getQuoteStub,
        },
      },
    })
  })

  afterEach(() => {
    this.sandbox.restore()
  })

  describe('setOrderBreadcrumb()', () => {
    it('should call setHomeBreadcrumb with order reference', () => {
      const nextSpy = this.sandbox.spy()

      this.middleware.setOrderBreadcrumb({}, this.resMock, nextSpy)

      expect(this.setHomeBreadcrumbStub).to.have.been.calledOnce
      expect(this.setHomeBreadcrumbStub).to.have.been.calledWith('12345/AS')

      expect(this.setHomeBreadcrumbReturnSpy).to.have.been.calledOnce
      expect(this.setHomeBreadcrumbReturnSpy).to.have.been.calledWith({}, this.resMock, nextSpy)
    })
  })

  describe('getQuote()', () => {
    beforeEach(() => {
      this.reqMock = {
        session: {
          token: '12345',
        },
      }
    })

    context('when Order.getQoute resolves', () => {
      beforeEach(() => {
        this.getQuoteStub.resolves({
          id: '12345',
        })
      })

      it('should set quote on locals object', (done) => {
        const nextSpy = () => {
          try {
            expect(this.resMock.locals).to.have.property('quote')
            expect(this.resMock.locals.quote).to.deep.equal({
              id: '12345',
            })
            done()
          } catch (error) {
            done(error)
          }
        }

        this.middleware.getQuote(this.reqMock, this.resMock, nextSpy)
      })
    })

    context('when Order.getQuote returns a 404', () => {
      beforeEach(() => {
        const error = {
          statusCode: 404,
        }
        this.getQuoteStub.rejects(error)
      })

      it('should set an empty quote object on locals object', (done) => {
        const nextSpy = (error) => {
          try {
            expect(this.resMock.locals).to.have.property('quote')
            expect(this.resMock.locals.quote).to.deep.equal({})
            expect(error).to.be.undefined
            done()
          } catch (error) {
            done(error)
          }
        }

        this.middleware.getQuote(this.reqMock, this.resMock, nextSpy)
      })
    })

    context('when Order.getQuote returns any other error', () => {
      beforeEach(() => {
        const error = {
          statusCode: 500,
        }
        this.getQuoteStub.rejects(error)
      })

      it('should set an empty quote object on locals object', (done) => {
        const nextSpy = (error) => {
          try {
            expect(error.statusCode).to.equal(500)
            done()
          } catch (error) {
            done(error)
          }
        }

        this.middleware.getQuote(this.reqMock, this.resMock, nextSpy)
      })
    })
  })
})
