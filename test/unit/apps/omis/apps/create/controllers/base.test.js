const FormController = require('hmpo-form-wizard').Controller

const Controller = require('~/src/apps/omis/apps/create/controllers/base')

describe('OMIS create base controller', () => {
  beforeEach(() => {
    this.sandbox = sinon.sandbox.create()
    this.controller = new Controller({ route: '/' })
  })

  afterEach(() => {
    this.sandbox.restore()
  })

  describe('getErrors()', () => {
    beforeEach(() => {
      this.getErrorsStub = this.sandbox.stub()

      FormController.prototype.getErrors = this.getErrorsStub
    })

    context('when parent returns empty errors object', () => {
      beforeEach(() => {
        this.getErrorsStub = this.getErrorsStub.returns({})
      })

      it('should set an empty message property', () => {
        const errors = this.controller.getErrors(globalReq, globalRes)

        expect(errors).to.deep.equal({
          messages: {},
        })
      })
    })

    context('when parent returns an errors object', () => {
      beforeEach(() => {
        this.getErrorsStub = this.getErrorsStub.returns({
          fieldOne: {
            key: 'fieldOne',
            type: 'required',
            message: 'cannot not be blank',
            url: '/step-url',
          },
          fieldTwo: {
            key: 'fieldTwo',
            type: 'required',
            message: 'cannot not be blank',
            url: '/step-url',
          },
        })
        this.reqMock = Object.assign({}, globalReq, {
          translate: (key) => {
            return key
          },
        })
      })

      it('should transform and append messages property', () => {
        const errors = this.controller.getErrors(this.reqMock, globalRes)

        expect(errors).to.deep.equal({
          fieldOne: {
            key: 'fieldOne',
            type: 'required',
            message: 'cannot not be blank',
            url: '/step-url',
          },
          fieldTwo: {
            key: 'fieldTwo',
            type: 'required',
            message: 'cannot not be blank',
            url: '/step-url',
          },
          messages: {
            fieldOne: 'fields.fieldOne.label cannot not be blank',
            fieldTwo: 'fields.fieldTwo.label cannot not be blank',
          },
        })
      })
    })
  })

  describe('errorHandler()', () => {
    beforeEach(() => {
      this.nextSpy = this.sandbox.spy()
      this.redirectSpy = this.sandbox.spy()
      this.errorHandlerSpy = this.sandbox.spy()
      this.resMock = Object.assign({}, globalRes, {
        redirect: this.redirectSpy,
      })

      FormController.prototype.errorHandler = this.errorHandlerSpy
    })

    describe('when it doesn\'t return missing prereq error', () => {
      beforeEach(() => {
        this.errorMock = new Error()
        this.errorMock.code = 'OTHER_ERROR'
      })

      it('should call next', () => {
        this.controller.errorHandler(this.errorMock, globalReq, this.resMock, this.nextSpy)

        expect(this.errorHandlerSpy).to.be.calledWith(this.errorMock, globalReq, this.resMock, this.nextSpy)
        expect(this.redirectSpy).not.to.be.called
      })
    })

    describe('when it returns missing prereq error', () => {
      beforeEach(() => {
        this.getStub = this.sandbox.stub()
        this.errorMock = new Error()
        this.errorMock.code = 'MISSING_PREREQ'
        this.reqMock = Object.assign({}, globalReq, {
          journeyModel: {
            get: this.getStub,
          },
        })
      })

      describe('when last step is not defined', () => {
        it('should redirect to the create first step', () => {
          this.getStub.returns([])
          this.controller.errorHandler(this.errorMock, this.reqMock, this.resMock, this.nextSpy)

          expect(this.redirectSpy).to.be.calledWith('/omis/create')
          expect(this.errorHandlerSpy).not.to.be.called
        })
      })

      describe('when last step is defined', () => {
        it('should redirect to the create first step', () => {
          const historyMock = [{
            path: 'first-item',
          }, {
            path: 'last-item',
          }]

          this.getStub.returns(historyMock)

          this.controller.errorHandler(this.errorMock, this.reqMock, this.resMock, this.nextSpy)

          expect(this.redirectSpy).to.be.calledWith('last-item')
          expect(this.errorHandlerSpy).not.to.be.called
        })
      })
    })
  })
})
