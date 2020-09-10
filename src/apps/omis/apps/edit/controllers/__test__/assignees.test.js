const proxyquire = require('proxyquire')

const FormController = require('../../../../controllers/form')
const orderMock = require('../../../../../../../test/unit/data/omis/simple-order.json')
const assigneesMock = require('../../../../../../../test/unit/data/omis/assignees.json')
const advisersMock = require('../../../../../../../test/unit/data/advisers/advisers.json')

const tokenMock = '12345abcde'

describe('OMIS edit subscribers controller', () => {
  beforeEach(() => {
    this.nextSpy = sinon.spy()
    this.getAdvisersStub = sinon.stub().resolves(advisersMock)
    this.getAssigneesStub = sinon.stub().resolves(assigneesMock)
    this.saveAssigneesStub = sinon.stub().resolves(assigneesMock)
    this.forceSaveAssigneesStub = sinon.stub().resolves(assigneesMock)

    const Controller = proxyquire('../assignees', {
      '../../../../adviser/repos': {
        getAdvisers: this.getAdvisersStub,
      },
      '../../../models': {
        Order: {
          getAssignees: this.getAssigneesStub,
          saveAssignees: this.saveAssigneesStub,
          forceSaveAssignees: this.forceSaveAssigneesStub,
        },
      },
    })

    this.controller = new Controller({ route: '/' })
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
              assignees: {
                children: [],
              },
            },
          },
        },
      })
      this.resMock = Object.assign({}, globalRes, {
        locals: {
          order: orderMock,
        },
      })

      sinon.spy(FormController.prototype, 'configure')
    })

    context('when async calls resolve', () => {
      beforeEach(async () => {
        await this.controller.configure(
          this.reqMock,
          this.resMock,
          this.nextSpy
        )
      })

      it('should set advisers as field options', () => {
        expect(
          this.reqMock.form.options.fields.assignees.options
        ).to.have.lengthOf(5)
        expect(
          this.reqMock.form.options.fields.assignees.options
        ).to.deep.equal([
          {
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
          },
        ])
      })

      it('should set assignees on the order object', () => {
        expect(this.resMock.locals.order).to.have.property('assignees')
        expect(this.resMock.locals.order.assignees).to.deep.equal(assigneesMock)
      })

      it('should call the parent method', () => {
        expect(FormController.prototype.configure).to.be.calledOnce
        expect(FormController.prototype.configure).to.be.calledWith(
          this.reqMock,
          this.resMock,
          this.nextSpy
        )
      })
    })

    context('when order is editable', () => {
      beforeEach(async () => {
        this.resMock.locals.order.canEditOrder = true

        await this.controller.configure(
          this.reqMock,
          this.resMock,
          this.nextSpy
        )
      })

      it('should allow assignees to be removed', () => {
        expect(this.reqMock.form.options.fields.assignees.canRemove).to.equal(
          true
        )
      })
    })

    context('when order is not editable', () => {
      beforeEach(async () => {
        this.resMock.locals.order.canEditOrder = false

        await this.controller.configure(
          this.reqMock,
          this.resMock,
          this.nextSpy
        )
      })

      it('should not allow assignees to be removed', () => {
        expect(this.reqMock.form.options.fields.assignees.canRemove).to.equal(
          false
        )
      })
    })

    context('when advisers are editable', () => {
      beforeEach(async () => {
        this.resMock.locals.order.canEditAdvisers = true

        await this.controller.configure(
          this.reqMock,
          this.resMock,
          this.nextSpy
        )
      })

      it('should not disable the form action', () => {
        expect(this.reqMock.form.options.disableFormAction).to.equal(false)
      })
    })

    context('when advisers are not editable', () => {
      beforeEach(async () => {
        this.resMock.locals.order.canEditAdvisers = false

        await this.controller.configure(
          this.reqMock,
          this.resMock,
          this.nextSpy
        )
      })

      it('should disable the form action', () => {
        expect(this.reqMock.form.options.disableFormAction).to.equal(true)
      })
    })

    context('when an async call rejects', () => {
      beforeEach(async () => {
        this.error = new Error('Async error')
        this.getAdvisersStub.rejects(this.error)

        await this.controller.configure(
          this.reqMock,
          this.resMock,
          this.nextSpy
        )
      })

      it('should call next with an error', () => {
        expect(this.nextSpy).to.have.been.calledWith(this.error)
      })
    })
  })

  describe('saveValues()', () => {
    beforeEach(() => {
      this.reqMock = Object.assign({}, globalReq, {
        form: {
          values: {
            assignees: [
              '33736be0-3e6b-4d4e-9fa8-32f23d0ba55e',
              '3cfad090-8f7e-4a8b-beb0-14c909d6f052',
            ],
          },
        },
        session: {
          token: tokenMock,
        },
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

    context('when save fails', () => {
      beforeEach(async () => {
        this.error = new Error('Async error')
        this.saveAssigneesStub.rejects(this.error)

        await this.controller.saveValues(
          this.reqMock,
          this.resMock,
          this.nextSpy
        )
      })

      it('should call next with an error', () => {
        expect(this.nextSpy).to.have.been.calledOnce
        expect(this.nextSpy).to.have.been.calledWith(this.error)
      })
    })

    context('when order is editable', () => {
      beforeEach(async () => {
        this.resMock.locals.order.canEditOrder = true

        await this.controller.saveValues(
          this.reqMock,
          this.resMock,
          this.nextSpy
        )
      })

      it('should not call save assignees method', () => {
        expect(this.saveAssigneesStub).not.to.have.been.called
      })

      it('should call force save assignees method', () => {
        expect(this.forceSaveAssigneesStub).to.have.been.calledOnce
        expect(this.forceSaveAssigneesStub).to.have.been.calledWith(
          this.reqMock,
          orderMock.id,
          [
            {
              adviser: {
                id: '33736be0-3e6b-4d4e-9fa8-32f23d0ba55e',
              },
            },
            {
              adviser: {
                id: '3cfad090-8f7e-4a8b-beb0-14c909d6f052',
              },
            },
          ]
        )
      })
    })

    context('when order is editable', () => {
      beforeEach(async () => {
        this.resMock.locals.order.canEditOrder = false

        await this.controller.saveValues(
          this.reqMock,
          this.resMock,
          this.nextSpy
        )
      })

      it('should not call force save method', () => {
        expect(this.forceSaveAssigneesStub).not.to.have.been.called
      })

      it('should call save assignees method', () => {
        expect(this.saveAssigneesStub).to.have.been.calledOnce
        expect(this.saveAssigneesStub).to.have.been.calledWith(
          this.reqMock,
          orderMock.id,
          [
            {
              adviser: {
                id: '33736be0-3e6b-4d4e-9fa8-32f23d0ba55e',
              },
            },
            {
              adviser: {
                id: '3cfad090-8f7e-4a8b-beb0-14c909d6f052',
              },
            },
          ]
        )
      })
    })
  })
})
