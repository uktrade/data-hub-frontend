const FormController = require('hmpo-form-wizard').Controller

const Controller = require('../form')

describe('OMIS FormController', () => {
  beforeEach(() => {
    this.nextSpy = sinon.stub()
    this.redirectSpy = sinon.spy()

    this.controller = new Controller({ route: '/' })
  })

  describe('render()', () => {
    beforeEach(() => {
      this.breadcrumbSpy = sinon.spy()
      this.reqMock = Object.assign({}, globalReq, {
        form: {
          options: {},
        },
      })
      this.resMock = Object.assign({}, globalRes, {
        breadcrumb: this.breadcrumbSpy,
      })
    })

    context('when a step heading doesn\'t exists', () => {
      it('should not set a breadcrumb item', () => {
        this.controller.render(this.reqMock, this.resMock, this.nextSpy)

        expect(this.breadcrumbSpy).not.to.have.been.called
        expect(this.nextSpy).to.have.been.calledWith()
      })
    })

    context('when a step heading exists', () => {
      it('should set append a breadcrumb item', () => {
        this.reqMock.form.options.heading = 'Step heading'
        this.controller.render(this.reqMock, this.resMock, this.nextSpy)

        expect(this.breadcrumbSpy).to.have.been.calledWith('Step heading')
        expect(this.nextSpy).to.have.been.calledWith()
      })
    })
  })

  describe('process()', () => {
    beforeEach(() => {
      this.reqMock = Object.assign({}, globalReq, {
        body: {},
        form: {
          values: {},
        },
        baseUrl: '/',
        path: 'path',
      })
      this.resMock = Object.assign({}, globalRes, {
        redirect: this.redirectSpy,
      })
    })

    context('when form submission is an add item', () => {
      beforeEach(() => {
        this.reqMock.body['add-item'] = 'fieldName'
      })

      it('should redirect to the same URL instead of calling next()', () => {
        FormController.prototype.saveValues = (req, res, next) => {
          next()

          expect(this.nextSpy).not.to.have.been.called
          expect(this.redirectSpy).to.have.been.calledWith('/path')
        }

        this.controller.process(this.reqMock, this.resMock, this.nextSpy)
      })

      context('when the current value is a string', () => {
        beforeEach(() => {
          this.reqMock.form.values.fieldName = ''
        })

        it('should convert to an array and append', () => {
          FormController.prototype.saveValues = (req, res, next) => {
            next()

            expect(this.reqMock.form.values.fieldName).to.deep.equal(['', ''])
          }

          this.controller.process(this.reqMock, this.resMock, this.nextSpy)
        })
      })

      context('when the current value is an array', () => {
        beforeEach(() => {
          this.reqMock.form.values.fieldName = ['one', 'two']
        })

        it('should append to the array', () => {
          FormController.prototype.saveValues = (req, res, next) => {
            next()

            expect(this.reqMock.form.values.fieldName).to.deep.equal(['one', 'two', ''])
          }

          this.controller.process(this.reqMock, this.resMock, this.nextSpy)
        })
      })
    })

    context('when form submission is a remove item', () => {
      beforeEach(() => {
        this.reqMock.body['remove-item'] = 'fieldName::1'
        this.reqMock.form.values.fieldName = ['one', 'two', 'three']
      })

      it('should redirect to the same URL instead of calling next()', () => {
        FormController.prototype.saveValues = (req, res, next) => {
          next()

          expect(this.nextSpy).not.to.have.been.called
          expect(this.redirectSpy).to.have.been.calledWith('/path')
        }

        this.controller.process(this.reqMock, this.resMock, this.nextSpy)
      })

      it('should remove the indexed item', () => {
        FormController.prototype.saveValues = (req, res, next) => {
          next()

          expect(this.reqMock.form.values.fieldName).to.deep.equal(['one', 'three'])
        }

        this.controller.process(this.reqMock, this.resMock, this.nextSpy)
      })
    })

    context('when form submission is a save', () => {
      beforeEach(() => {
        this.saveValuesSpy = sinon.spy()
        this.reqMock = Object.assign({}, globalReq, {
          form: {
            values: {
              nonRepeatableField: 'foo',
            },
            options: {
              fields: {
                repeatableField: { repeatable: true },
                nonRepeatableField: {},
              },
            },
          },
        })

        FormController.prototype.saveValues = this.saveValuesSpy
      })

      it('should not call parent saveValues()', () => {
        this.controller.process(this.reqMock, this.resMock, this.nextSpy)

        expect(this.saveValuesSpy).not.to.have.been.called
      })

      it('should call next()', () => {
        this.controller.process(this.reqMock, this.resMock, this.nextSpy)

        expect(this.nextSpy).to.have.been.calledOnce
        expect(this.nextSpy).to.have.been.calledWith()
      })

      context('when a repeatable field is not an array', () => {
        beforeEach(() => {
          this.reqMock.form.values.repeatableField = ''
        })

        it('should convert it to an array', () => {
          this.controller.process(this.reqMock, globalRes, this.nextSpy)

          expect(this.reqMock.form.values).to.deep.equal({
            nonRepeatableField: 'foo',
            repeatableField: [],
          })
        })
      })

      context('when a repeatable field has falsey values', () => {
        beforeEach(() => {
          this.reqMock.form.values.repeatableField = ['', 'foo', undefined, 'bar', false]
        })

        it('should filter falseys out', () => {
          this.controller.process(this.reqMock, globalRes, this.nextSpy)

          expect(this.reqMock.form.values).to.deep.equal({
            nonRepeatableField: 'foo',
            repeatableField: ['foo', 'bar'],
          })
        })
      })
    })
  })

  describe('getErrors()', () => {
    beforeEach(() => {
      this.getErrorsStub = sinon.stub()

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
          assignee_time: {
            key: 'assignee_time',
            type: 'required',
            message: 'cannot be blank',
            url: '/step-url',
          },
          assignee_actual_time: {
            key: 'assignee_actual_time',
            type: 'required',
            message: 'cannot be blank',
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
          assignee_time: {
            key: 'assignee_time',
            type: 'required',
            message: 'cannot be blank',
            url: '/step-url',
          },
          assignee_actual_time: {
            key: 'assignee_actual_time',
            type: 'required',
            message: 'cannot be blank',
            url: '/step-url',
          },
          messages: {
            assignee_time: 'Estimated hours cannot be blank',
            assignee_actual_time: 'Actual hours worked cannot be blank',
          },
        })
      })
    })
  })

  describe('errorHandler()', () => {
    beforeEach(() => {
      this.errorHandlerSpy = sinon.spy()
      this.breadcrumbSpy = sinon.stub().returnsThis()
      this.renderSpy = sinon.spy()
      this.resMock = Object.assign({}, globalRes, {
        redirect: this.redirectSpy,
        breadcrumb: this.breadcrumbSpy,
        render: this.renderSpy,
      })

      FormController.prototype.errorHandler = this.errorHandlerSpy
    })

    context('when it doesn\'t return missing prereq error', () => {
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

    context('when a redirect property is set', () => {
      beforeEach(() => {
        this.errorMock = new Error()
        this.errorMock.code = 'MISSING_PREREQ'
        this.errorMock.redirect = '/error-redirect-path/'

        this.controller.errorHandler(this.errorMock, globalReq, this.resMock, this.nextSpy)
      })

      it('redirect to specificed value', () => {
        expect(this.redirectSpy).to.be.calledWith(this.errorMock.redirect)
      })

      it('should not call error handler', () => {
        expect(this.errorHandlerSpy).not.to.be.called
      })
    })

    context('when it returns session timeout error', () => {
      beforeEach(() => {
        this.errorMock = new Error()
        this.errorMock.code = 'SESSION_TIMEOUT'
        this.reqMock = Object.assign({}, globalReq, {
          baseUrl: '/journey-base-url',
        })

        this.controller.errorHandler(this.errorMock, this.reqMock, this.resMock, this.nextSpy)
      })

      it('should set a breadcrumb item', () => {
        expect(this.breadcrumbSpy).to.be.calledWith('Session expired')
      })

      it('should render the timeout template', () => {
        expect(this.renderSpy.args[0][0]).to.equal('omis/apps/create/views/timeout')
      })

      it('should pass the correct data to the view', () => {
        expect(this.renderSpy.args[0][1]).to.deep.equal({
          baseUrl: '/journey-base-url',
        })
      })

      it('should not call error handler', () => {
        expect(this.errorHandlerSpy).not.to.be.called
      })
    })
  })
})
