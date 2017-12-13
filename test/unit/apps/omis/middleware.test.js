const companyData = require('~/test/unit/data/company.json')
const orderData = require('~/test/unit/data/omis/simple-order.json')

describe('OMIS middleware', () => {
  beforeEach(() => {
    this.setHomeBreadcrumbReturnSpy = sandbox.spy()
    this.setHomeBreadcrumbStub = sandbox.stub().returns(this.setHomeBreadcrumbReturnSpy)
    this.getDitCompanyStub = sandbox.stub()
    this.getByIdStub = sandbox.stub()
    this.loggerSpy = sandbox.spy()
    this.nextSpy = sandbox.spy()

    this.resMock = {
      locals: {},
    }
    this.reqMock = {
      session: {
        token: 'session-12345',
      },
    }

    this.middleware = proxyquire('~/src/apps/omis/middleware', {
      '../companies/repos': {
        getDitCompany: this.getDitCompanyStub,
      },
      '../../../config/logger': {
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

  afterEach(() => {
    this.sandbox.restore()
  })

  describe('setCompany()', () => {
    beforeEach(() => {
      this.companyId = 'c-1234567890'
    })

    context('when get company resolves', () => {
      beforeEach(() => {
        this.getDitCompanyStub.resolves(companyData)
      })

      it('should call getDitCompany() with correct arguments', async () => {
        await this.middleware.setCompany(this.reqMock, this.resMock, this.nextSpy, this.companyId)

        expect(this.getDitCompanyStub).to.have.been.calledWith(this.reqMock.session.token, this.companyId)
      })

      it('should set a company property on locals', async () => {
        await this.middleware.setCompany(this.reqMock, this.resMock, this.nextSpy, this.companyId)

        expect(this.resMock.locals).to.have.property('company')
        expect(this.resMock.locals.company).to.deep.equal(companyData)
      })

      it('should call next with no errors', async () => {
        await this.middleware.setCompany(this.reqMock, this.resMock, this.nextSpy, this.companyId)

        expect(this.nextSpy).to.have.been.calledWith()
      })
    })

    context('when a company rejects', () => {
      beforeEach(() => {
        this.error = {
          statusCode: 404,
        }
        this.getDitCompanyStub.rejects(this.error)
      })

      it('should call next with an error', async () => {
        await this.middleware.setCompany(this.reqMock, this.resMock, this.nextSpy, this.companyId)

        expect(this.nextSpy).to.have.been.calledWith(this.error)
      })

      it('should not set a company property on locals', async () => {
        await this.middleware.setCompany(this.reqMock, this.resMock, this.nextSpy, this.companyId)

        expect(this.resMock.locals).to.not.have.property('company')
      })
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
        await this.middleware.setOrder(this.reqMock, this.resMock, this.nextSpy, this.orderId)

        expect(this.getByIdStub).to.have.been.calledWith(this.reqMock.session.token, this.orderId)
      })

      it('should set a order property on locals', async () => {
        await this.middleware.setOrder(this.reqMock, this.resMock, this.nextSpy, this.orderId)

        const order = Object.assign({}, orderData, {
          canEditOrder: true,
          canEditAdvisers: true,
        })
        expect(this.resMock.locals).to.have.property('order')
        expect(this.resMock.locals.order).to.deep.equal(order)
      })

      it('should call next with no errors', async () => {
        await this.middleware.setOrder(this.reqMock, this.resMock, this.nextSpy, this.orderId)

        expect(this.nextSpy).to.have.been.calledWith()
      })

      context('when order is in draft', () => {
        beforeEach(async () => {
          const draftOrder = Object.assign({}, orderData, {
            status: 'draft',
          })
          this.getByIdStub.resolves(draftOrder)

          await this.middleware.setOrder(this.reqMock, this.resMock, this.nextSpy, this.orderId)
        })

        it('should be able to edit order', () => {
          expect(this.resMock.locals.order.canEditOrder).to.equal(true)
        })

        it('should be able to edit advisers', () => {
          expect(this.resMock.locals.order.canEditAdvisers).to.equal(true)
        })
      })

      context('when order is not in draft', () => {
        beforeEach(async () => {
          const quoteOrder = Object.assign({}, orderData, {
            status: 'quote_awaiting_acceptance',
          })
          this.getByIdStub.resolves(quoteOrder)

          await this.middleware.setOrder(this.reqMock, this.resMock, this.nextSpy, this.orderId)
        })

        it('should not be able to edit order', () => {
          expect(this.resMock.locals.order.canEditOrder).to.equal(false)
        })

        it('should be able to edit advisers', () => {
          expect(this.resMock.locals.order.canEditAdvisers).to.equal(true)
        })
      })

      context('when order is complete', () => {
        beforeEach(async () => {
          const quoteOrder = Object.assign({}, orderData, {
            status: 'complete',
          })
          this.getByIdStub.resolves(quoteOrder)

          await this.middleware.setOrder(this.reqMock, this.resMock, this.nextSpy, this.orderId)
        })

        it('should not be able to edit order', () => {
          expect(this.resMock.locals.order.canEditOrder).to.equal(false)
        })

        it('should not be able to edit advisers', () => {
          expect(this.resMock.locals.order.canEditAdvisers).to.equal(false)
        })
      })

      context('when order is cancelled', () => {
        beforeEach(async () => {
          const quoteOrder = Object.assign({}, orderData, {
            status: 'cancelled',
          })
          this.getByIdStub.resolves(quoteOrder)

          await this.middleware.setOrder(this.reqMock, this.resMock, this.nextSpy, this.orderId)
        })

        it('should not be able to edit order', () => {
          expect(this.resMock.locals.order.canEditOrder).to.equal(false)
        })

        it('should not be able to edit advisers', () => {
          expect(this.resMock.locals.order.canEditAdvisers).to.equal(false)
        })
      })
    })

    context('when a model method rejects', () => {
      beforeEach(async () => {
        this.error = {
          statusCode: 404,
        }
        this.getByIdStub.rejects(this.error)

        await this.middleware.setOrder(this.reqMock, this.resMock, this.nextSpy, this.orderId)
      })

      it('should not set an order property on locals', () => {
        expect(this.resMock.locals).to.not.have.property('order')
      })

      it('should call next with an error', () => {
        expect(this.nextSpy).to.have.been.calledWith(this.error)
      })
    })
  })

  describe('setOrderBreadcrumb()', () => {
    beforeEach(() => {
      this.resMock.locals.order = {
        id: '123456789',
        reference: '12345/AS',
      }
    })

    it('should call setHomeBreadcrumb with order reference', () => {
      this.middleware.setOrderBreadcrumb({}, this.resMock, this.nextSpy)

      expect(this.setHomeBreadcrumbStub).to.have.been.calledOnce
      expect(this.setHomeBreadcrumbStub).to.have.been.calledWith('12345/AS')

      expect(this.setHomeBreadcrumbReturnSpy).to.have.been.calledOnce
      expect(this.setHomeBreadcrumbReturnSpy).to.have.been.calledWith({}, this.resMock, this.nextSpy)
    })
  })
})
