describe('OMIS View middleware', () => {
  beforeEach(() => {
    this.sandbox = sinon.sandbox.create()

    this.getCompanySpy = this.sandbox.spy()
    this.previewQuoteStub = this.sandbox.stub()
    this.getQuoteStub = this.sandbox.stub()
    this.createQuoteStub = this.sandbox.stub()
    this.cancelQuoteStub = this.sandbox.stub()
    this.flashSpy = this.sandbox.spy()
    this.nextSpy = this.sandbox.spy()

    this.resMock = {
      locals: {
        order: {
          id: '123456789',
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
      '../../middleware': {
        getCompany: this.getCompanySpy,
      },
      '../../models': {
        Order: {
          previewQuote: this.previewQuoteStub,
          getQuote: this.getQuoteStub,
          createQuote: this.createQuoteStub,
          cancelQuote: this.cancelQuoteStub,
        },
      },
      '../edit/steps': {
        '/one': {
          heading: 'Step one',
          fields: [
            'service_types',
          ],
        },
        '/two': {
          heading: 'Step two',
          fields: [
            'foo',
            'bar',
          ],
        },
        '/three': {
          heading: 'Step three',
          fields: [
            'description',
          ],
        },
        '@noCallThru': true,
      },
    })
  })

  afterEach(() => {
    this.sandbox.restore()
  })

  describe('setTranslation()', () => {
    it('should set a translate method on locals', () => {
      this.middleware.setTranslation({}, this.resMock, this.nextSpy)

      expect(this.resMock.locals).to.have.property('translate')
      expect(this.resMock.locals.translate).to.be.a('function')
      expect(this.nextSpy).to.have.been.calledOnce

      expect(this.resMock.locals.translate('translation.key')).to.equal('translation.key')
    })
  })

  describe('setCompany()', () => {
    context('when no order exists', () => {
      beforeEach(() => {
        this.middleware.setCompany({}, this.resMock, this.nextSpy)
      })

      it('should not call company middleware', () => {
        expect(this.getCompanySpy).not.to.have.been.called
      })

      it('should call next', () => {
        expect(this.nextSpy).to.have.been.called
      })
    })

    context('when an order exists', () => {
      beforeEach(() => {
        this.resMock.locals.order.company = {
          id: 'company-id',
        }
        this.middleware.setCompany({}, this.resMock, this.nextSpy)
      })

      it('should call company middleware with correct arguments', () => {
        expect(this.getCompanySpy).to.have.been.calledOnce
        expect(this.getCompanySpy).to.have.been.calledWith({}, this.resMock, this.nextSpy, 'company-id')
      })

      it('should not call next itself', () => {
        expect(this.nextSpy).not.to.have.been.called
      })
    })
  })

  describe('getQuote()', () => {
    context('when no quote exists', () => {
      beforeEach(() => {
        this.previewQuoteStub.resolves({
          id: '12345',
          content: 'Quote content',
        })
      })

      it('should set response as quote property on locals', async () => {
        await this.middleware.getQuote(this.reqMock, this.resMock, this.nextSpy)

        expect(this.resMock.locals).to.have.property('quote')
        expect(this.resMock.locals.quote).to.deep.equal({
          id: '12345',
          content: 'Quote content',
        })
        expect(this.nextSpy).to.have.been.calledWith()
      })
    })

    context('when quote already exists', () => {
      beforeEach(() => {
        const error = {
          statusCode: 409,
        }
        this.previewQuoteStub.rejects(error)
      })

      context('when quote is returned', () => {
        beforeEach(() => {
          const mockDate = new Date('2017-08-01')
          this.clock = sinon.useFakeTimers(mockDate.getTime())

          this.getQuoteStub.resolves({
            id: '12345',
            content: 'Quote content',
          })
        })

        afterEach(() => {
          this.clock.restore()
        })

        it('should set response as quote property on locals', async () => {
          await this.middleware.getQuote(this.reqMock, this.resMock, this.nextSpy)

          expect(this.resMock.locals).to.have.property('quote')
          expect(this.resMock.locals.quote).to.deep.equal({
            id: '12345',
            expired: false,
            content: 'Quote content',
          })
          expect(this.nextSpy).to.have.been.calledWith()
        })

        context('when quote has not expired', () => {
          beforeEach(() => {
            this.getQuoteStub.resolves({
              id: '12345',
              expires_on: '2017-08-10',
            })
          })

          it('should set expired property to false', async () => {
            await this.middleware.getQuote(this.reqMock, this.resMock, this.nextSpy)

            expect(this.resMock.locals).to.have.property('quote')
            expect(this.resMock.locals.quote).to.deep.equal({
              id: '12345',
              expired: false,
              expires_on: '2017-08-10',
            })
            expect(this.nextSpy).to.have.been.calledWith()
          })
        })

        context('when quote has expired', () => {
          beforeEach(() => {
            this.getQuoteStub.resolves({
              id: '12345',
              expires_on: '2017-07-10',
            })
          })

          it('should set expired property to true', async () => {
            await this.middleware.getQuote(this.reqMock, this.resMock, this.nextSpy)

            expect(this.resMock.locals).to.have.property('quote')
            expect(this.resMock.locals.quote).to.deep.equal({
              id: '12345',
              expired: true,
              expires_on: '2017-07-10',
            })
            expect(this.nextSpy).to.have.been.calledWith()
          })
        })
      })

      context('when quote cannot be returned', () => {
        beforeEach(() => {
          this.error = {
            statusCode: 404,
          }
          this.getQuoteStub.rejects(this.error)
        })

        it('should call next with the error', async () => {
          await this.middleware.getQuote(this.reqMock, this.resMock, this.nextSpy)

          expect(this.nextSpy).to.have.been.calledWith(this.error)
        })
      })

      context('when quote preview generates an unexpected error', () => {
        beforeEach(() => {
          this.error = {
            statusCode: 500,
          }
          this.previewQuoteStub.rejects(this.error)
        })

        it('should call next with the error', async () => {
          await this.middleware.getQuote(this.reqMock, this.resMock, this.nextSpy)

          expect(this.nextSpy).to.have.been.calledWith(this.error)
        })
      })
    })

    context('when quote cannot be generated because of errors', () => {
      beforeEach(() => {
        const error = {
          statusCode: 400,
          error: {
            'service_types': ['Required'],
            'description': ['Required'],
          },
        }
        this.previewQuoteStub.rejects(error)
      })

      it('should set errors on locals', async () => {
        await this.middleware.getQuote(this.reqMock, this.resMock, this.nextSpy)

        expect(this.resMock.locals).to.have.property('incompleteFields')
        expect(this.resMock.locals.incompleteFields).to.deep.equal({
          '/one': {
            heading: 'Step one',
            errors: [
              'service_types',
            ],
          },
          '/three': {
            heading: 'Step three',
            errors: [
              'description',
            ],
          },
        })
      })

      it('should return next without error', async () => {
        await this.middleware.getQuote(this.reqMock, this.resMock, this.nextSpy)

        expect(this.nextSpy).to.have.been.calledWith()
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

  describe('cancelQuote()', () => {
    context('when Order.cancelQuote resolves', () => {
      beforeEach(() => {
        this.cancelQuoteStub.resolves({
          created_on: '2017-08-31T15:10:41.119609',
          created_by: {
            'name': 'Rebecca Bah',
            'id': '3cfad090-8f7e-4a8b-beb0-14c909d6f052',
          },
          cancelled_on: '2017-09-02T15:10:41.119609',
          cancelled_by: {
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

        this.middleware.cancelQuote(this.reqMock, resMock, this.nextSpy)
      })
    })

    context('when Order.cancelQuote returns a 404', () => {
      beforeEach(() => {
        const error = {
          statusCode: 404,
        }
        this.cancelQuoteStub.rejects(error)
      })

      it('should set flash and redirect', (done) => {
        const resMock = Object.assign({}, this.resMock, {
          redirect: (path) => {
            try {
              expect(this.nextSpy).not.to.have.been.called
              expect(this.flashSpy).to.have.been.calledOnce
              expect(path).to.equal('/omis/123456789/quote')
              done()
            } catch (error) {
              done(error)
            }
          },
        })

        this.middleware.cancelQuote(this.reqMock, resMock, this.nextSpy)
      })
    })

    context('when Order.cancelQuote returns a 409', () => {
      beforeEach(() => {
        const error = {
          statusCode: 409,
        }
        this.cancelQuoteStub.rejects(error)
      })

      it('should set flash and redirect', (done) => {
        const resMock = Object.assign({}, this.resMock, {
          redirect: (path) => {
            try {
              expect(this.nextSpy).not.to.have.been.called
              expect(this.flashSpy).to.have.been.calledOnce
              expect(path).to.equal('/omis/123456789/quote')
              done()
            } catch (error) {
              done(error)
            }
          },
        })

        this.middleware.cancelQuote(this.reqMock, resMock, this.nextSpy)
      })
    })

    context('when Order.cancelQuote returns any other error', () => {
      beforeEach(() => {
        this.error = new Error('Server error')
        this.error.statusCode = 500

        this.cancelQuoteStub.rejects(this.error)
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

        this.middleware.cancelQuote(this.reqMock, this.resMock, nextSpy)
      })
    })
  })

  describe('setQuoteForm()', () => {
    beforeEach(() => {
      this.resMock.locals.quote = {}
    })

    context('when quote does not exist', () => {
      it('should set default quoteForm object', (done) => {
        const nextSpy = () => {
          try {
            expect(this.resMock.locals).to.have.property('quoteForm')

            expect(this.resMock.locals.quoteForm).to.have.property('buttonText')
            expect(this.resMock.locals.quoteForm).to.have.property('returnText')
            expect(this.resMock.locals.quoteForm).to.have.property('returnLink')

            done()
          } catch (error) {
            done(error)
          }
        }

        this.middleware.setQuoteForm({}, this.resMock, nextSpy)
      })
    })

    context('when quote preview errors exist exist', () => {
      beforeEach(() => {
        this.resMock.locals.incompleteFields = ['service_types']
      })

      it('should set disable the form actions', (done) => {
        const nextSpy = () => {
          try {
            expect(this.resMock.locals).to.have.property('quoteForm')

            expect(this.resMock.locals.quoteForm).to.have.property('buttonText')
            expect(this.resMock.locals.quoteForm).to.have.property('returnText')
            expect(this.resMock.locals.quoteForm).to.have.property('returnLink')
            expect(this.resMock.locals.quoteForm).to.have.property('disableFormAction', true)

            done()
          } catch (error) {
            done(error)
          }
        }

        this.middleware.setQuoteForm({}, this.resMock, nextSpy)
      })
    })

    context('when quote exists', () => {
      beforeEach(() => {
        this.resMock.locals.quote.created_on = '2017-08-01'
        this.resMock.locals.quote.expires_on = '2017-09-01'
      })

      it('should set change quoteForm object', (done) => {
        const nextSpy = () => {
          try {
            expect(this.resMock.locals.quoteForm).to.have.property('action', '/omis/123456789/quote/cancel')
            expect(this.resMock.locals.quoteForm).to.have.property('buttonText', 'Cancel quote')
            expect(this.resMock.locals.quoteForm).to.have.property('buttonModifiers', 'button-secondary')

            done()
          } catch (error) {
            done(error)
          }
        }

        this.middleware.setQuoteForm({}, this.resMock, nextSpy)
      })

      context('when quote has not expired', () => {
        beforeEach(() => {
          const mockDate = new Date('2017-08-01')

          this.clock = sinon.useFakeTimers(mockDate.getTime())
          this.resMock.locals.quote.expires_on = '2017-08-10'
        })

        afterEach(() => {
          this.clock.restore()
        })

        context('when quote has not been accpeted or cancelled', () => {
          it('should allow destructive cancel', (done) => {
            const nextSpy = () => {
              try {
                expect(this.resMock.locals.quoteForm).to.have.property('action', '/omis/123456789/quote/cancel')
                expect(this.resMock.locals.quoteForm).to.have.property('buttonText', 'Cancel quote')
                expect(this.resMock.locals.quoteForm).to.have.property('buttonModifiers', 'button--destructive')

                done()
              } catch (error) {
                done(error)
              }
            }

            this.middleware.setQuoteForm({}, this.resMock, nextSpy)
          })
        })

        context('when quote has been accepted', () => {
          it('should disable form actions', (done) => {
            const nextSpy = () => {
              try {
                expect(this.resMock.locals.quoteForm).to.have.property('disableFormAction', true)

                done()
              } catch (error) {
                done(error)
              }
            }

            this.resMock.locals.quote.accepted_on = '2017-08-02'

            this.middleware.setQuoteForm({}, this.resMock, nextSpy)
          })
        })

        context('when quote has been cancelled', () => {
          it('should disable form actions', (done) => {
            const nextSpy = () => {
              try {
                expect(this.resMock.locals.quoteForm).to.have.property('disableFormAction', true)

                done()
              } catch (error) {
                done(error)
              }
            }

            this.resMock.locals.quote.cancelled_on = '2017-08-02'

            this.middleware.setQuoteForm({}, this.resMock, nextSpy)
          })
        })
      })
    })
  })
})
