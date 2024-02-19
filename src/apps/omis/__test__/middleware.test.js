const proxyquire = require('proxyquire')

const orderData = require('../../../../test/unit/data/omis/simple-order.json')

describe('OMIS middleware', () => {
  beforeEach(() => {
    this.setHomeBreadcrumbReturnSpy = sinon.spy()
    this.setHomeBreadcrumbStub = sinon
      .stub()
      .returns(this.setHomeBreadcrumbReturnSpy)
    this.getDitCompanyStub = sinon.stub()
    this.getByIdStub = sinon.stub()
    this.loggerSpy = sinon.spy()
    this.nextSpy = sinon.spy()

    this.resMock = {
      locals: {},
    }
    this.reqMock = {
      session: {
        token: 'session-12345',
      },
    }

    this.middleware = proxyquire('../middleware', {
      '../companies/repos': {
        getDitCompany: this.getDitCompanyStub,
      },
      '../../config/logger': {
        error: this.loggerSpy,
      },
      '../middleware': {
        setHomeBreadcrumb: this.setHomeBreadcrumbStub,
      },
      './models': {
        Order: {
          getById: this.getByIdStub,
        },
      },
    })
  })

  describe('setOrder()', () => {
    beforeEach(() => {
      this.orderId = 'o-1234567890'
    })

    context('when model methods resolve', () => {
      beforeEach(() => {
        this.getByIdStub.resolves(orderData)
      })

      it('should call model methods with correct arguments', async () => {
        await this.middleware.setOrder(
          this.reqMock,
          this.resMock,
          this.nextSpy,
          this.orderId
        )

        expect(this.getByIdStub).to.have.been.calledWith(
          this.reqMock,
          this.orderId
        )
      })

      it('should set a order property on locals', async () => {
        await this.middleware.setOrder(
          this.reqMock,
          this.resMock,
          this.nextSpy,
          this.orderId
        )

        const order = Object.assign({}, orderData, {
          canEditOrder: true,
          canEditAdvisers: true,
          canEditInvoiceDetails: true,
          canEditContactDetails: true,
        })
        expect(this.resMock.locals).to.have.property('order')
        expect(this.resMock.locals.order).to.deep.equal(order)
      })

      it('should call next with no errors', async () => {
        await this.middleware.setOrder(
          this.reqMock,
          this.resMock,
          this.nextSpy,
          this.orderId
        )

        expect(this.nextSpy).to.have.been.calledWith()
      })

      context('when order is in draft', () => {
        beforeEach(async () => {
          const draftOrder = Object.assign({}, orderData, {
            status: 'draft',
          })
          this.getByIdStub.resolves(draftOrder)

          await this.middleware.setOrder(
            this.reqMock,
            this.resMock,
            this.nextSpy,
            this.orderId
          )
        })

        it('should be able to edit order', () => {
          expect(this.resMock.locals.order.canEditOrder).to.equal(true)
        })

        it('should be able to edit advisers', () => {
          expect(this.resMock.locals.order.canEditAdvisers).to.equal(true)
        })

        it('should not be able to edit contact details', () => {
          expect(this.resMock.locals.order.canEditContactDetails).to.equal(true)
        })
      })

      context('when order is in quote awaiting acceptance', () => {
        beforeEach(async () => {
          const quoteOrder = Object.assign({}, orderData, {
            status: 'quote_awaiting_acceptance',
          })
          this.getByIdStub.resolves(quoteOrder)

          await this.middleware.setOrder(
            this.reqMock,
            this.resMock,
            this.nextSpy,
            this.orderId
          )
        })

        it('should not be able to edit order', () => {
          expect(this.resMock.locals.order.canEditOrder).to.equal(false)
        })

        it('should be able to edit advisers', () => {
          expect(this.resMock.locals.order.canEditAdvisers).to.equal(true)
        })

        it('should be able to edit invoice details', () => {
          expect(this.resMock.locals.order.canEditInvoiceDetails).to.equal(true)
        })

        it('should be able to edit contact details', () => {
          expect(this.resMock.locals.order.canEditContactDetails).to.equal(true)
        })
      })

      context('when order is complete', () => {
        beforeEach(async () => {
          const quoteOrder = Object.assign({}, orderData, {
            status: 'complete',
          })
          this.getByIdStub.resolves(quoteOrder)

          await this.middleware.setOrder(
            this.reqMock,
            this.resMock,
            this.nextSpy,
            this.orderId
          )
        })

        it('should not be able to edit order', () => {
          expect(this.resMock.locals.order.canEditOrder).to.equal(false)
        })

        it('should not be able to edit advisers', () => {
          expect(this.resMock.locals.order.canEditAdvisers).to.equal(false)
        })

        it('should not be able to edit invoice details', () => {
          expect(this.resMock.locals.order.canEditInvoiceDetails).to.equal(
            false
          )
        })

        it('should not be able to edit contact details', () => {
          expect(this.resMock.locals.order.canEditContactDetails).to.equal(
            false
          )
        })
      })

      context('when order is cancelled', () => {
        beforeEach(async () => {
          const quoteOrder = Object.assign({}, orderData, {
            status: 'cancelled',
          })
          this.getByIdStub.resolves(quoteOrder)

          await this.middleware.setOrder(
            this.reqMock,
            this.resMock,
            this.nextSpy,
            this.orderId
          )
        })

        it('should not be able to edit order', () => {
          expect(this.resMock.locals.order.canEditOrder).to.equal(false)
        })

        it('should not be able to edit advisers', () => {
          expect(this.resMock.locals.order.canEditAdvisers).to.equal(false)
        })

        it('should not be able to edit invoice details', () => {
          expect(this.resMock.locals.order.canEditInvoiceDetails).to.equal(
            false
          )
        })

        it('should not be able to edit contact details', () => {
          expect(this.resMock.locals.order.canEditContactDetails).to.equal(
            false
          )
        })
      })
    })

    context('when a model method rejects', () => {
      beforeEach(async () => {
        this.error = {
          statusCode: 404,
        }
        this.getByIdStub.rejects(this.error)

        await this.middleware.setOrder(
          this.reqMock,
          this.resMock,
          this.nextSpy,
          this.orderId
        )
      })

      it('should not set an order property on locals', () => {
        expect(this.resMock.locals).to.not.have.property('order')
      })

      it('should call next with an error', () => {
        expect(this.nextSpy).to.have.been.calledWith(this.error)
      })
    })
  })
})
