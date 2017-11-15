const contactMock = require('~/test/unit/data/contacts/contacts')[0]
const invoiceMock = require('~/test/unit/data/omis/invoice')
const paymentsMock = require('~/test/unit/data/omis/payments')

describe('OMIS View middleware', () => {
  beforeEach(() => {
    this.sandbox = sinon.sandbox.create()

    this.getCompanySpy = this.sandbox.spy()
    this.loggerErrorSpy = this.sandbox.spy()
    this.getContactStub = this.sandbox.stub()
    this.previewQuoteStub = this.sandbox.stub()
    this.getQuoteStub = this.sandbox.stub()
    this.getInvoiceStub = this.sandbox.stub()
    this.getPaymentsStub = this.sandbox.stub()
    this.createQuoteStub = this.sandbox.stub()
    this.cancelQuoteStub = this.sandbox.stub()
    this.transformPaymentToViewStub = this.sandbox.stub().returnsArg(0)
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
      '../../transformers': {
        transformPaymentToView: this.transformPaymentToViewStub,
      },
      '../../../../../config/logger': {
        error: this.loggerErrorSpy,
      },
      '../../../contacts/repos': {
        getContact: this.getContactStub,
      },
      '../../models': {
        Order: {
          previewQuote: this.previewQuoteStub,
          getQuote: this.getQuoteStub,
          getInvoice: this.getInvoiceStub,
          getPayments: this.getPaymentsStub,
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

  describe('setContact()', () => {
    context('when invoice call resolves', () => {
      beforeEach(async () => {
        this.getContactStub.resolves(contactMock)

        await this.middleware.setContact(this.reqMock, this.resMock, this.nextSpy)
      })

      it('should set contact property on locals', () => {
        expect(this.resMock.locals.order).to.have.property('contact')
      })

      it('should set correct contact object', () => {
        expect(this.resMock.locals.order.contact).to.deep.equal(contactMock)
      })

      it('should call next', () => {
        expect(this.nextSpy).to.have.been.calledWith()
      })
    })

    context('when call generates an error', () => {
      beforeEach(async () => {
        this.error = {
          statusCode: 500,
        }
        this.getContactStub.rejects(this.error)

        await this.middleware.setContact(this.reqMock, this.resMock, this.nextSpy)
      })

      it('should log error', () => {
        expect(this.loggerErrorSpy).to.have.been.calledOnce
        expect(this.loggerErrorSpy).to.have.been.calledWith(this.error)
      })

      it('should call next', () => {
        expect(this.nextSpy).to.have.been.calledWith()
      })
    })
  })

  describe('setQuoteSummary()', () => {
    context('when order is awaiting quote acceptance', () => {
      beforeEach(() => {
        this.resMock.locals.order.status = 'quote_awaiting_acceptance'
      })

      context('when quote resolves', () => {
        beforeEach(() => {
          const mockDate = new Date('2017-08-01')
          this.clock = sinon.useFakeTimers(mockDate.getTime())
        })

        afterEach(() => {
          this.clock.restore()
        })

        context('when quote has not expired', () => {
          beforeEach(async () => {
            this.getQuoteStub.resolves({
              id: '12345',
              content: 'Quote content',
            })

            await this.middleware.setQuoteSummary(this.reqMock, this.resMock, this.nextSpy)
          })

          it('should make quote request', () => {
            expect(this.getQuoteStub).to.have.been.calledWith(this.reqMock.session.token, this.resMock.locals.order.id)
          })

          it('should set response as quote property on locals', () => {
            expect(this.resMock.locals).to.have.property('quote')
            expect(this.resMock.locals.quote).to.deep.equal({
              id: '12345',
              expired: false,
              content: 'Quote content',
            })
          })

          it('should call next', () => {
            expect(this.nextSpy).to.have.been.calledWith()
          })
        })

        context('when quote has expired', () => {
          beforeEach(async () => {
            this.getQuoteStub.resolves({
              id: '12345',
              expires_on: '2017-07-10',
            })

            await this.middleware.setQuoteSummary(this.reqMock, this.resMock, this.nextSpy)
          })

          it('should set expired property to true', async () => {
            expect(this.resMock.locals).to.have.property('quote')
            expect(this.resMock.locals.quote).to.deep.equal({
              id: '12345',
              expired: true,
              expires_on: '2017-07-10',
            })
          })
        })
      })

      context('when quote rejects', () => {
        beforeEach(async () => {
          this.error = {
            statusCode: 409,
          }
          this.getQuoteStub.rejects(this.error)

          await this.middleware.setQuoteSummary(this.reqMock, this.resMock, this.nextSpy)
        })

        it('should make quote request', () => {
          expect(this.getQuoteStub).to.have.been.calledWith(this.reqMock.session.token, this.resMock.locals.order.id)
        })

        it('should log error', () => {
          expect(this.loggerErrorSpy).to.have.been.calledOnce
          expect(this.loggerErrorSpy).to.have.been.calledWith(this.error)
        })

        it('should call next', () => {
          expect(this.nextSpy).to.have.been.calledWith()
        })
      })
    })

    context('when order is not  awaiting quote acceptance', () => {
      beforeEach(async () => {
        this.resMock.locals.order.status = 'draft'

        await this.middleware.setQuoteSummary(this.reqMock, this.resMock, this.nextSpy)
      })

      it('should not make quote request', () => {
        expect(this.getQuoteStub).not.to.have.been.called
      })

      it('should call next', () => {
        expect(this.nextSpy).to.have.been.calledWith()
      })
    })
  })

  describe('setQuotePreview()', () => {
    context('when an order is in draft', () => {
      beforeEach(() => {
        this.resMock.locals.order.status = 'draft'
      })

      context('when quote preview resolves', () => {
        beforeEach(async () => {
          this.previewQuoteStub.resolves({
            id: '12345',
            content: 'Quote content',
          })

          await this.middleware.setQuotePreview(this.reqMock, this.resMock, this.nextSpy)
        })

        it('should set response as quote property on locals', () => {
          expect(this.resMock.locals).to.have.property('quote')
          expect(this.resMock.locals.quote).to.deep.equal({
            id: '12345',
            content: 'Quote content',
          })
        })

        it('should call next', () => {
          expect(this.nextSpy).to.have.been.calledWith()
        })
      })

      context('when quote preview generates an unexpected error', () => {
        beforeEach(async () => {
          this.error = {
            statusCode: 500,
          }
          this.previewQuoteStub.rejects(this.error)

          await this.middleware.setQuotePreview(this.reqMock, this.resMock, this.nextSpy)
        })

        it('should log error', () => {
          expect(this.loggerErrorSpy).to.have.been.calledOnce
          expect(this.loggerErrorSpy).to.have.been.calledWith(this.error)
        })

        it('should call next', () => {
          expect(this.nextSpy).to.have.been.calledWith()
        })
      })

      context('when quote preview cannot be generated because of errors', () => {
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
          await this.middleware.setQuotePreview(this.reqMock, this.resMock, this.nextSpy)

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
          await this.middleware.setQuotePreview(this.reqMock, this.resMock, this.nextSpy)

          expect(this.nextSpy).to.have.been.calledWith()
        })
      })
    })

    context('when an order is in draft', () => {
      beforeEach(async () => {
        this.resMock.locals.order.status = 'quote_accepted'
        await this.middleware.setQuotePreview(this.reqMock, this.resMock, this.nextSpy)
      })

      it('should not make quote preview request', () => {
        expect(this.previewQuoteStub).not.to.have.been.called
      })

      it('should call next', () => {
        expect(this.nextSpy).to.have.been.calledWith()
      })
    })
  })

  describe('setQuote()', () => {
    context('when an order is not in draft', () => {
      beforeEach(() => {
        this.resMock.locals.order.status = 'complete'
      })

      context('when quote resolves', () => {
        beforeEach(async () => {
          this.getQuoteStub.resolves({
            id: '12345',
            content: 'Quote content',
          })

          await this.middleware.setQuote(this.reqMock, this.resMock, this.nextSpy)
        })

        it('should set response as quote property on locals', () => {
          expect(this.resMock.locals).to.have.property('quote')
          expect(this.resMock.locals.quote).to.deep.equal({
            id: '12345',
            expired: false,
            content: 'Quote content',
          })
        })

        it('should call next', () => {
          expect(this.nextSpy).to.have.been.calledWith()
        })
      })

      context('when quote generates a 404', () => {
        beforeEach(async () => {
          this.error = {
            statusCode: 404,
          }
          this.getQuoteStub.rejects(this.error)

          await this.middleware.setQuote(this.reqMock, this.resMock, this.nextSpy)
        })

        it('should not log error', () => {
          expect(this.loggerErrorSpy).not.to.have.been.called
        })

        it('should call next', () => {
          expect(this.nextSpy).to.have.been.calledWith()
        })
      })

      context('when quote generates an unexpected error', () => {
        beforeEach(async () => {
          this.error = {
            statusCode: 500,
          }
          this.getQuoteStub.rejects(this.error)

          await this.middleware.setQuote(this.reqMock, this.resMock, this.nextSpy)
        })

        it('should log error', () => {
          expect(this.loggerErrorSpy).to.have.been.calledOnce
          expect(this.loggerErrorSpy).to.have.been.calledWith(this.error)
        })

        it('should call next', () => {
          expect(this.nextSpy).to.have.been.calledWith()
        })
      })
    })
  })

  describe('setInvoice()', () => {
    context('when invoice call resolves', () => {
      beforeEach(async () => {
        this.getInvoiceStub.resolves(invoiceMock)

        await this.middleware.setInvoice(this.reqMock, this.resMock, this.nextSpy)
      })

      it('should set response as quote property on locals', () => {
        expect(this.resMock.locals).to.have.property('invoice')
        expect(this.resMock.locals.invoice).to.deep.equal(invoiceMock)
      })

      it('should call next', () => {
        expect(this.nextSpy).to.have.been.calledWith()
      })
    })

    context('when call generates an error', () => {
      beforeEach(async () => {
        this.error = {
          statusCode: 500,
        }
        this.getInvoiceStub.rejects(this.error)

        await this.middleware.setInvoice(this.reqMock, this.resMock, this.nextSpy)
      })

      it('should log error', () => {
        expect(this.loggerErrorSpy).to.have.been.calledOnce
        expect(this.loggerErrorSpy).to.have.been.calledWith(this.error)
      })

      it('should call next', () => {
        expect(this.nextSpy).to.have.been.calledWith()
      })
    })
  })

  describe('setPayments()', () => {
    context('when invoice call resolves', () => {
      beforeEach(async () => {
        this.getPaymentsStub.resolves(paymentsMock)

        await this.middleware.setPayments(this.reqMock, this.resMock, this.nextSpy)
      })

      it('should set payments property on locals', () => {
        expect(this.resMock.locals).to.have.property('payments')
      })

      it('should set correct number of payments', () => {
        expect(this.resMock.locals.payments).to.have.length(2)
      })

      it('should set correct objects on payments', () => {
        expect(this.resMock.locals.payments).to.deep.equal(paymentsMock)
      })

      it('should call next', () => {
        expect(this.nextSpy).to.have.been.calledWith()
      })
    })

    context('when call generates an error', () => {
      beforeEach(async () => {
        this.error = {
          statusCode: 500,
        }
        this.getPaymentsStub.rejects(this.error)

        await this.middleware.setPayments(this.reqMock, this.resMock, this.nextSpy)
      })

      it('should log error', () => {
        expect(this.loggerErrorSpy).to.have.been.calledOnce
        expect(this.loggerErrorSpy).to.have.been.calledWith(this.error)
      })

      it('should call next', () => {
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

    context('when quote preview errors exist', () => {
      beforeEach(() => {
        this.resMock.locals.incompleteFields = ['service_types']
      })

      it('should hide the primary form action', (done) => {
        const nextSpy = () => {
          try {
            expect(this.resMock.locals).to.have.property('quoteForm')

            expect(this.resMock.locals.quoteForm).to.have.property('buttonText')
            expect(this.resMock.locals.quoteForm).to.have.property('returnText')
            expect(this.resMock.locals.quoteForm).to.have.property('returnLink')
            expect(this.resMock.locals.quoteForm).to.have.property('hidePrimaryFormAction', true)

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
                expect(this.resMock.locals.quoteForm).to.have.property('hidePrimaryFormAction', true)

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
          it('should contain default form actions', (done) => {
            const nextSpy = () => {
              try {
                expect(this.resMock.locals.quoteForm).to.have.property('buttonText', 'Send quote to client')
                expect(this.resMock.locals.quoteForm).to.have.property('returnText', 'Return to order')
                expect(this.resMock.locals.quoteForm).to.have.property('returnLink', '/omis/123456789')
                expect(this.resMock.locals.quoteForm).to.not.have.property('hidePrimaryFormAction')

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
