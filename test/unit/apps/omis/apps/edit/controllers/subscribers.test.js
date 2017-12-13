const FormController = require('~/src/apps/omis/controllers/form')

const orderMock = require('~/test/unit/data/omis/simple-order.json')
const subscribersMock = require('~/test/unit/data/omis/subscribers.json')
const advisersMock = require('~/test/unit/data/advisers/advisers.json')

const tokenMock = '12345abcde'

describe('OMIS edit subscribers controller', () => {
  beforeEach(() => {
    this.nextSpy = sandbox.spy()
    this.getAdvisersStub = sandbox.stub().resolves(advisersMock)
    this.getSubscribersStub = sandbox.stub().resolves(subscribersMock)
    this.saveSubscribersStub = sandbox.stub().resolves(subscribersMock)

    const Controller = proxyquire('~/src/apps/omis/apps/edit/controllers/subscribers', {
      '../../../../adviser/repos': {
        getAdvisers: this.getAdvisersStub,
      },
      '../../../models': {
        Order: {
          getSubscribers: this.getSubscribersStub,
          saveSubscribers: this.saveSubscribersStub,
        },
      },
    })

    this.controller = new Controller({ route: '/' })
  })

  afterEach(() => {
    this.sandbox.restore()
  })

  describe('configure()', () => {
    beforeEach(() => {
      this.reqMock = Object.assign({}, globalReq, {
        session: {
          token: tokenMock,
        },
        form: {
          options: {
            fields: {
              subscribers: {},
            },
          },
        },
      })
      this.resMock = Object.assign({}, globalRes, {
        locals: {
          order: orderMock,
        },
      })

      sandbox.spy(FormController.prototype, 'configure')
    })

    context('when async calls resolve', () => {
      beforeEach(async () => {
        await this.controller.configure(this.reqMock, this.resMock, this.nextSpy)
      })

      it('should set advisers as field options', () => {
        expect(this.reqMock.form.options.fields.subscribers.options).to.have.lengthOf(5)
        expect(this.reqMock.form.options.fields.subscribers.options).to.deep.equal([{
          value: 'e13209b8-8d61-e311-8255-e4115bead28a',
          label: 'Aaron Mr',
        },
        {
          value: '0919a99e-9798-e211-a939-e4115bead28a',
          label: 'Fred Rafters',
        },
        {
          value: '0119a99e-9798-e211-a939-e4115bead28a',
          label: 'George Chan',
        },
        {
          value: 'a0dae366-1134-e411-985c-e4115bead28a',
          label: 'Jeff Smith',
        },
        {
          value: 'b9d6b3dc-7af4-e411-bcbe-e4115bead28a',
          label: 'Mr Benjamin',
        }])
      })

      it('should set subscribers on the order object', () => {
        expect(this.resMock.locals.order).to.have.property('subscribers')
        expect(this.resMock.locals.order.subscribers).to.deep.equal(subscribersMock)
      })

      it('should call the parent method', () => {
        expect(FormController.prototype.configure).to.be.calledOnce
        expect(FormController.prototype.configure).to.be.calledWith(this.reqMock, this.resMock, this.nextSpy)
      })
    })

    context('when advisers are editable', () => {
      beforeEach(async () => {
        this.resMock.locals.order.canEditAdvisers = true

        await this.controller.configure(this.reqMock, this.resMock, this.nextSpy)
      })

      it('should not disable the form action', () => {
        expect(this.reqMock.form.options.disableFormAction).to.equal(false)
      })
    })

    context('when advisers are not editable', () => {
      beforeEach(async () => {
        this.resMock.locals.order.canEditAdvisers = false

        await this.controller.configure(this.reqMock, this.resMock, this.nextSpy)
      })

      it('should disable the form action', () => {
        expect(this.reqMock.form.options.disableFormAction).to.equal(true)
      })
    })

    context('when an async call rejects', () => {
      beforeEach(async () => {
        this.error = new Error('Async error')
        this.getAdvisersStub.rejects(this.error)

        await this.controller.configure(this.reqMock, this.resMock, this.nextSpy)
      })

      it('should call next with an error', () => {
        expect(this.nextSpy).to.have.been.calledWith(this.error)
      })
    })
  })

  describe('successHandler()', () => {
    beforeEach(() => {
      this.resetSpy = sandbox.spy()
      this.destroySpy = sandbox.spy()
      this.flashSpy = sandbox.spy()
      this.redirectSpy = sandbox.spy()

      this.reqMock = Object.assign({}, globalReq, {
        form: {
          options: {
            fields: {
              subscribers: {},
              fizz: {},
            },
          },
        },
        session: {
          token: tokenMock,
        },
        sessionModel: {
          toJSON: () => {
            return {
              'csrf-secret': 'secret-key',
              errors: {},
              subscribers: [
                '33736be0-3e6b-4d4e-9fa8-32f23d0ba55e',
                '3cfad090-8f7e-4a8b-beb0-14c909d6f052',
              ],
              fizz: 'buzz',
            }
          },
          reset: this.resetSpy,
          destroy: this.destroySpy,
        },
        journeyModel: {
          reset: this.resetSpy,
          destroy: this.destroySpy,
        },
        flash: this.flashSpy,
      })

      this.resMock = Object.assign({}, globalRes, {
        locals: {
          order: {
            id: orderMock.id,
          },
        },
        redirect: this.redirectSpy,
      })
    })

    context('when an async call rejects', () => {
      beforeEach(async () => {
        this.error = new Error('Async error')
        this.saveSubscribersStub.rejects(this.error)

        await this.controller.successHandler(this.reqMock, this.resMock, this.nextSpy)
      })

      it('should call next with an error', () => {
        expect(this.nextSpy).to.have.been.calledWith(this.error)
      })
    })

    context('when order is editable', () => {
      beforeEach(async () => {
        this.resMock.locals.order.canEditOrder = true

        await this.controller.successHandler(this.reqMock, this.resMock, this.nextSpy)
      })

      it('should force save assignees', () => {
        expect(this.saveSubscribersStub).to.have.been.calledOnce
        expect(this.saveSubscribersStub).to.have.been.calledWith(tokenMock, orderMock.id, [{
          id: '33736be0-3e6b-4d4e-9fa8-32f23d0ba55e',
        }, {
          id: '3cfad090-8f7e-4a8b-beb0-14c909d6f052',
        }])
      })

      it('should reset the models', () => {
        expect(this.resetSpy).to.have.been.calledTwice
        expect(this.destroySpy).to.have.been.calledTwice
      })

      it('should set a flash message', () => {
        expect(this.flashSpy).to.have.been.calledOnce
      })

      it('should redirect back to the order', () => {
        expect(this.redirectSpy).to.have.been.calledOnce
        expect(this.redirectSpy).to.have.been.calledWith(`/omis/${orderMock.id}`)
      })
    })

    context('when next is set', () => {
      it('should redirect back to returnUrl', async () => {
        this.reqMock.form.options.next = '/custom-return-url'

        await this.controller.successHandler(this.reqMock, this.resMock, this.nextSpy)

        expect(this.redirectSpy).to.have.been.calledOnce
        expect(this.redirectSpy).to.have.been.calledWith('/custom-return-url')
      })
    })
  })
})
