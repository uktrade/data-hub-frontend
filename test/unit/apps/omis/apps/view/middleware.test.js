describe('OMIS View middleware', () => {
  beforeEach(() => {
    this.sandbox = sinon.sandbox.create()

    this.setHomeBreadcrumbReturnSpy = this.sandbox.spy()
    this.setHomeBreadcrumbStub = this.sandbox.stub().returns(this.setHomeBreadcrumbReturnSpy)
    this.getQuoteStub = this.sandbox.stub()
    this.createQuoteStub = this.sandbox.stub()
    this.flashSpy = this.sandbox.spy()
    this.nextSpy = this.sandbox.spy()

    this.resMock = {
      locals: {
        order: {
          id: '123456789',
          reference: '12345/AS',
        },
      },
    }
    this.reqMock = {
      session: {
        token: '12345',
      },
      flash: this.flashSpy,
    }

    this.middleware = proxyquire('~/src/apps/omis/apps/view/middleware', {
      '../../../middleware': {
        setHomeBreadcrumb: this.setHomeBreadcrumbStub,
      },
      '../../models': {
        Order: {
          getQuote: this.getQuoteStub,
          createQuote: this.createQuoteStub,
        },
      },
    })
  })

  afterEach(() => {
    this.sandbox.restore()
  })

  describe('setOrderBreadcrumb()', () => {
    it('should call setHomeBreadcrumb with order reference', () => {
      this.middleware.setOrderBreadcrumb({}, this.resMock, this.nextSpy)

      expect(this.setHomeBreadcrumbStub).to.have.been.calledOnce
      expect(this.setHomeBreadcrumbStub).to.have.been.calledWith('12345/AS')

      expect(this.setHomeBreadcrumbReturnSpy).to.have.been.calledOnce
      expect(this.setHomeBreadcrumbReturnSpy).to.have.been.calledWith({}, this.resMock, this.nextSpy)
    })
  })

  describe('getQuote()', () => {
    context('when Order.getQuote resolves', () => {
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

  describe('generateQuote()', () => {
    context('when Order.createQuote resolves', () => {
      beforeEach(() => {
        this.createQuoteStub.resolves({
          created_on: '2017-08-31T15:10:41.119609',
          created_by: {
            'name': 'Rebecca Bah',
            'id': '3cfad090-8f7e-4a8b-beb0-14c909d6f052',
          },
        })
      })

      it('should redirect back to order page', (done) => {
        const resMock = Object.assign({}, this.resMock, {
          redirect: (path) => {
            try {
              expect(this.nextSpy).not.to.have.been.called
              expect(this.flashSpy).to.have.been.calledOnce
              expect(path).to.equal('/omis/123456789')
              done()
            } catch (error) {
              done(error)
            }
          },
        })

        this.middleware.generateQuote(this.reqMock, resMock, this.nextSpy)
      })
    })

    context('when Order.createQuote returns a 400', () => {
      beforeEach(() => {
        const error = {
          statusCode: 400,
        }
        this.createQuoteStub.rejects(error)
      })

      it('should set flash and redirect', (done) => {
        const resMock = Object.assign({}, this.resMock, {
          redirect: (path) => {
            try {
              expect(this.nextSpy).not.to.have.been.called
              expect(this.flashSpy).to.have.been.calledOnce
              expect(path).to.equal('/omis/123456789')
              done()
            } catch (error) {
              done(error)
            }
          },
        })

        this.middleware.generateQuote(this.reqMock, resMock, this.nextSpy)
      })
    })

    context('when Order.createQuote returns a 409', () => {
      beforeEach(() => {
        const error = {
          statusCode: 409,
        }
        this.createQuoteStub.rejects(error)
      })

      it('should set flash and redirect', (done) => {
        const resMock = Object.assign({}, this.resMock, {
          redirect: (path) => {
            try {
              expect(this.nextSpy).not.to.have.been.called
              expect(this.flashSpy).to.have.been.calledOnce
              expect(path).to.equal('/omis/123456789')
              done()
            } catch (error) {
              done(error)
            }
          },
        })

        this.middleware.generateQuote(this.reqMock, resMock, this.nextSpy)
      })
    })

    context('when Order.createQuote returns any other error', () => {
      beforeEach(() => {
        this.error = new Error('Server error')
        this.error.statusCode = 500

        this.createQuoteStub.rejects(this.error)
      })

      it('should set an empty quote object on locals object', (done) => {
        const nextSpy = (error) => {
          try {
            expect(error).to.deep.equal(this.error)
            done()
          } catch (error) {
            done(error)
          }
        }

        this.middleware.generateQuote(this.reqMock, this.resMock, nextSpy)
      })
    })
  })

  describe('setQuoteForm()', () => {
    it('should set quoteForm on locals object', (done) => {
      const nextSpy = () => {
        try {
          expect(this.resMock.locals).to.have.property('quoteForm')
          done()
        } catch (error) {
          done(error)
        }
      }

      this.middleware.setQuoteForm({}, this.resMock, nextSpy)
    })
  })
})
