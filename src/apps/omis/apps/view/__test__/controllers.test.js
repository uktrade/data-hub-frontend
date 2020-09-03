const proxyquire = require('proxyquire')

const subscriberData = require('../../../../../../test/unit/data/omis/subscribers.json')
const assigneeData = require('../../../../../../test/unit/data/omis/assignees.json')
const paymentData = require('../../../../../../test/unit/data/omis/payments.json')
const contactData = require('../../../../../../test/unit/data/contacts/contact.json')

const orderMock = {
  id: '1230asd-123dasda',
  status: 'draft',
  contact: contactData,
  foo: 'bar',
}
const tokenMock = 'session-12345'
const transformerStub = (item) => {
  return item
}

describe('OMIS View controllers', () => {
  beforeEach(() => {
    this.transformSubscriberToViewStub = sinon.stub().returns(transformerStub)

    this.controllers = proxyquire('../controllers', {
      '../../transformers': {
        transformSubscriberToView: this.transformSubscriberToViewStub,
      },
    })
  })

  describe('renderWorkOrder()', () => {
    beforeEach(() => {
      this.breadcrumbSpy = sinon.stub().returnsThis()
      this.renderSpy = sinon.spy()

      this.resMock = {
        breadcrumb: this.breadcrumbSpy,
        render: this.renderSpy,
        locals: {
          order: orderMock,
          subscribers: subscriberData,
          assignees: assigneeData,
        },
      }
      this.reqMock = {
        session: {
          token: tokenMock,
        },
      }

      this.controllers.renderWorkOrder(this.reqMock, this.resMock)
    })

    it('should not set a breadcrumb option', () => {
      expect(this.breadcrumbSpy).not.to.have.been.called
    })

    it('should render a template', () => {
      expect(this.renderSpy).to.have.been.called
    })

    it('should send values property to view', () => {
      expect(this.renderSpy.firstCall.args[1]).to.have.property('values')
    })

    it('should contain correct values', () => {
      const values = this.renderSpy.firstCall.args[1].values

      expect(values).to.have.property('assignees')
      expect(values).to.have.property('subscribers')
      expect(values).to.have.property('contact')
      expect(values).to.have.property('estimatedTimeSum')
    })

    it('should set the correct time sum', () => {
      const values = this.renderSpy.firstCall.args[1].values

      expect(values.estimatedTimeSum).to.be.a('number').to.equal(450)
    })
  })

  describe('renderQuote()', () => {
    beforeEach(() => {
      this.breadcrumbSpy = sinon.stub().returnsThis()
      this.renderSpy = sinon.spy()

      this.resMock = {
        breadcrumb: this.breadcrumbSpy,
        render: this.renderSpy,
      }

      this.controllers.renderQuote({}, this.resMock)
    })

    it('should set a breadcrumb option', () => {
      expect(this.breadcrumbSpy).to.have.been.called
    })

    it('should render a template', () => {
      expect(this.renderSpy).to.have.been.called
    })
  })

  describe('renderPaymentReceipt()', () => {
    beforeEach(() => {
      this.breadcrumbSpy = sinon.stub().returnsThis()
      this.renderSpy = sinon.spy()
      this.redirectSpy = sinon.spy()

      this.resMock = {
        breadcrumb: this.breadcrumbSpy,
        redirect: this.redirectSpy,
        render: this.renderSpy,
        locals: {
          order: orderMock,
        },
      }
    })

    context('when an order is not paid', () => {
      it('should redirect back to the order overview', () => {
        this.controllers.renderPaymentReceipt({}, this.resMock)

        expect(this.redirectSpy).to.have.been.calledWith(
          `/omis/${this.resMock.locals.order.id}`
        )
      })
    })

    context('when an order has been paid', () => {
      beforeEach(() => {
        this.resMock.locals.payments = paymentData
      })

      it('should set a breadcrumb option', () => {
        this.controllers.renderPaymentReceipt({}, this.resMock)

        expect(this.breadcrumbSpy).to.have.been.called
      })

      it('should render a template', () => {
        this.controllers.renderPaymentReceipt({}, this.resMock)

        expect(this.renderSpy).to.have.been.called
      })

      it('should not redirect', () => {
        this.controllers.renderPaymentReceipt({}, this.resMock)

        expect(this.redirectSpy).not.to.have.been.called
      })
    })
  })
})
