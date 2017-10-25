const subscriberData = require('~/test/unit/data/omis/subscribers.json')
const assigneeData = require('~/test/unit/data/omis/assignees.json')
const contactData = require('~/test/unit/data/simple-contact')

const orderMock = {
  id: '1230asd-123dasda',
  status: 'draft',
  contact: {
    id: '123dasda-1230asd',
  },
  foo: 'bar',
}
const tokenMock = 'session-12345'

describe('OMIS View controllers', () => {
  beforeEach(() => {
    this.sandbox = sinon.sandbox.create()

    this.getSubscribersStub = this.sandbox.stub().resolves(subscriberData)
    this.getAssigneesStub = this.sandbox.stub().resolves(assigneeData)
    this.getContactStub = this.sandbox.stub().resolves(contactData)
    this.loggerSpy = this.sandbox.spy()

    this.controllers = proxyquire('~/src/apps/omis/apps/view/controllers', {
      '../../../../../config/logger': {
        error: this.loggerSpy,
      },
      '../../models': {
        Order: {
          getSubscribers: this.getSubscribersStub,
          getAssignees: this.getAssigneesStub,
        },
      },
      '../../../contacts/repos': {
        getContact: this.getContactStub,
      },
    })
  })

  afterEach(() => {
    this.sandbox.restore()
  })

  describe('renderWorkOrder()', () => {
    beforeEach(() => {
      this.breadcrumbSpy = this.sandbox.stub().returnsThis()
      this.renderSpy = this.sandbox.spy()

      this.resMock = {
        breadcrumb: this.breadcrumbSpy,
        render: this.renderSpy,
        locals: {
          order: orderMock,
        },
      }
      this.reqMock = {
        session: {
          token: tokenMock,
        },
      }
    })

    it('should not set a breadcrumb option', async () => {
      await this.controllers.renderWorkOrder(this.reqMock, this.resMock)

      expect(this.breadcrumbSpy).not.to.have.been.called
    })

    it('should render a template', async () => {
      await this.controllers.renderWorkOrder(this.reqMock, this.resMock)

      expect(this.renderSpy).to.have.been.called
    })

    context('when api calls resolve', () => {
      beforeEach(async () => {
        await this.controllers.renderWorkOrder(this.reqMock, this.resMock)
      })

      it('should get subscribers with correct args', () => {
        expect(this.getSubscribersStub).to.have.been.calledWith(tokenMock, orderMock.id)
      })

      it('should get assignees with correct args', () => {
        expect(this.getAssigneesStub).to.have.been.calledWith(tokenMock, orderMock.id)
      })

      it('should get contact with correct args', () => {
        expect(this.getContactStub).to.have.been.calledWith(tokenMock, orderMock.contact.id)
      })

      it('should call correct template', () => {
        expect(this.renderSpy.args[0][0]).to.equal('omis/apps/view/views/work-order')
      })

      it('should send correct properties to view', () => {
        const values = this.renderSpy.args[0][1].values

        expect(values).to.have.property('id')
        expect(values).to.have.property('contact')
        expect(values).to.have.property('foo')
        expect(values).to.have.property('subscribers')
        expect(values).to.have.property('assignees')
        expect(values).to.have.property('estimatedTimeSum')
      })

      it('should send correct subscribers', () => {
        const values = this.renderSpy.args[0][1].values

        expect(values.subscribers).to.be.an('array').to.have.length(2)
      })

      it('should send correct assignees', () => {
        const values = this.renderSpy.args[0][1].values

        expect(values.assignees).to.be.an('array').to.have.length(2)
      })

      it('should merge short contact with full contact', () => {
        const values = this.renderSpy.args[0][1].values

        expect(values.contact).to.be.an('object').to.deep.equal(contactData)
      })

      it('should estimate sum correctly', () => {
        const values = this.renderSpy.args[0][1].values

        expect(values.estimatedTimeSum).to.be.a('number').to.equal(450)
      })
    })

    context('when api calls reject', () => {
      beforeEach(async () => {
        this.error = {
          statusCode: 500,
        }
        this.getSubscribersStub.rejects(this.error)

        await this.controllers.renderWorkOrder(this.reqMock, this.resMock)
      })

      it('values should not be defined', () => {
        expect(this.renderSpy).to.have.been.calledWith('omis/apps/view/views/work-order', {
          values: undefined,
        })
      })

      it('should log the error', () => {
        expect(this.loggerSpy).to.have.been.calledWith(this.error)
        expect(this.loggerSpy).to.have.been.calledOnce
      })
    })
  })

  describe('renderQuote()', () => {
    beforeEach(() => {
      this.breadcrumbSpy = this.sandbox.stub().returnsThis()
      this.renderSpy = this.sandbox.spy()

      this.resMock = {
        breadcrumb: this.breadcrumbSpy,
        render: this.renderSpy,
      }
    })

    it('should set a breadcrumb option', () => {
      this.controllers.renderQuote({}, this.resMock)

      expect(this.breadcrumbSpy).to.have.been.called
    })

    it('should render a template', () => {
      this.controllers.renderQuote({}, this.resMock)

      expect(this.renderSpy).to.have.been.called
    })
  })

  describe('renderPaymentReceipt()', () => {
    beforeEach(() => {
      this.breadcrumbSpy = this.sandbox.stub().returnsThis()
      this.renderSpy = this.sandbox.spy()
      this.redirectSpy = this.sandbox.spy()

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

        expect(this.redirectSpy).to.have.been.calledWith(`/omis/${this.resMock.locals.order.id}`)
      })
    })

    context('when an order is in paid state', () => {
      beforeEach(() => {
        this.resMock.locals.order.status = 'paid'
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
