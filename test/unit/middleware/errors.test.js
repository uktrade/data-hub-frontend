const proxyquire = require('proxyquire')

const errorCode404 = 404
const errorCode403 = 403
const errorCode500 = 500
const isDev = true

describe('Error Middleware Test', () => {
  beforeEach(() => {
    this.sandbox = sinon.sandbox.create()
    this.winstonErrorStub = this.sandbox.stub()
    this.winstonInfoStub = this.sandbox.stub()

    this.errorsStub = (isDev) => {
      return proxyquire('~/src/middleware/errors', {
        '../../config': {
          isDev,
        },
        '../../config/logger': {
          error: this.winstonErrorStub,
          info: this.winstonInfoStub,
        },
      })
    }
  })

  afterEach(() => {
    this.sandbox.restore()
  })

  describe('notFound method', () => {
    it('should log a 404 and drop through to next middleware', () => {
      const nextSpy = this.sandbox.spy()
      const mockResponse = {
        locals: {
          BREADCRUMBS: [],
        },
      }

      this.errorsStub(isDev).notFound(null, mockResponse, nextSpy)

      expect(nextSpy.calledOnce).to.be.true
      expect(nextSpy.args[0][0] instanceof Error).to.be.true
      expect(nextSpy.args[0][0].message).to.equal('Not Found')
      expect(nextSpy.args[0][0].statusCode).to.equal(404)
    })
  })

  describe('catchAll method', () => {
    beforeEach(() => {
      this.nextSpy = this.sandbox.spy()
      this.statusStub = this.sandbox.stub().returnsThis()
      this.renderSpy = this.sandbox.spy()
      this.error = new Error('A mock error')

      this.responseMock = {
        status: this.statusStub,
        render: this.renderSpy,
        locals: {
          BREADCRUMBS: [],
        },
      }
    })

    context('when header have already been sent', () => {
      beforeEach(() => {
        this.responseMock.headersSent = true
        this.errorsStub(isDev).catchAll(this.error, null, this.responseMock, this.nextSpy)
      })

      it('should call next middleware with error', () => {
        expect(this.nextSpy).to.have.been.calledOnce
        expect(this.nextSpy).to.have.been.calledWith(this.error)
      })

      it('should not render a template', () => {
        expect(this.renderSpy).not.to.have.been.called
      })
    })

    context('when not in development mode', () => {
      beforeEach(() => {
        this.errorsStub(false).catchAll(this.error, null, this.responseMock, this.nextSpy)
      })

      it('should send showStackTrace property to template', () => {
        expect(this.renderSpy.args[0][1]).to.have.property('showStackTrace')
      })

      it('should set showStackTrace to false', () => {
        expect(this.renderSpy.args[0][1].showStackTrace).to.equal(false)
      })
    })

    context('with a 404 error status code', () => {
      beforeEach(() => {
        this.error.statusCode = errorCode404
        this.errorsStub(isDev).catchAll(this.error, null, this.responseMock, this.nextSpy)
      })

      it('should set correct status code on response', () => {
        expect(this.statusStub).to.have.been.calledOnce
        expect(this.statusStub).to.have.been.calledWith(errorCode404)
      })

      it('should call the errors template', () => {
        expect(this.renderSpy).to.have.been.calledOnce
        expect(this.renderSpy.args[0][0]).to.equal('errors')
      })

      it('should pass correct values to template', () => {
        expect(this.renderSpy.args[0][1]).to.deep.equal({
          error: this.error,
          statusCode: errorCode404,
          statusMessage: 'Page not found',
          showStackTrace: true,
        })
      })

      it('should not render breadcrumbs', () => {
        expect(this.responseMock.locals.BREADCRUMBS).to.equal(null)
      })

      it('should log info level message to logger', () => {
        expect(this.winstonInfoStub).to.have.been.calledOnce
        expect(this.winstonInfoStub).to.have.been.calledWith(this.error)
      })

      it('should not log error level message to logger', () => {
        expect(this.winstonErrorStub).not.to.have.been.called
      })

      it('should not call next', () => {
        expect(this.nextSpy).not.to.have.been.called
      })
    })

    context('with a standard 403 error status code', () => {
      beforeEach(() => {
        this.error.statusCode = errorCode403
        this.errorsStub(isDev).catchAll(this.error, null, this.responseMock, this.nextSpy)
      })

      it('should set correct status code on response', () => {
        expect(this.statusStub).to.have.been.calledOnce
        expect(this.statusStub).to.have.been.calledWith(errorCode403)
      })

      it('should call the errors template', () => {
        expect(this.renderSpy).to.have.been.calledOnce
        expect(this.renderSpy.args[0][0]).to.equal('errors')
      })

      it('should pass correct values to template', () => {
        expect(this.renderSpy.args[0][1]).to.deep.equal({
          error: this.error,
          statusCode: errorCode403,
          statusMessage: 'You don’t have permission to view this page',
          showStackTrace: true,
        })
      })

      it('should not render breadcrumbs', () => {
        expect(this.responseMock.locals.BREADCRUMBS).to.equal(null)
      })

      it('should log error level message to logger', () => {
        expect(this.winstonErrorStub).to.have.been.calledOnce
        expect(this.winstonErrorStub).to.have.been.calledWith(this.error)
      })

      it('should not log info level message to logger', () => {
        expect(this.winstonInfoStub).not.to.have.been.called
      })

      it('should not call next', () => {
        expect(this.nextSpy).not.to.have.been.called
      })
    })

    context('with a CSRF 403 error status code', () => {
      beforeEach(() => {
        this.error.statusCode = errorCode403
        this.error.code = 'EBADCSRFTOKEN'
        this.errorsStub(isDev).catchAll(this.error, null, this.responseMock, this.nextSpy)
      })

      it('should set correct status code on response', () => {
        expect(this.statusStub).to.have.been.calledOnce
        expect(this.statusStub).to.have.been.calledWith(errorCode403)
      })

      it('should call the errors template', () => {
        expect(this.renderSpy).to.have.been.calledOnce
        expect(this.renderSpy.args[0][0]).to.equal('errors')
      })

      it('should pass correct values to template', () => {
        expect(this.renderSpy.args[0][1]).to.deep.equal({
          error: this.error,
          statusCode: errorCode403,
          statusMessage: 'This form has been tampered with',
          showStackTrace: true,
        })
      })

      it('should not render breadcrumbs', () => {
        expect(this.responseMock.locals.BREADCRUMBS).to.equal(null)
      })

      it('should log error level message to logger', () => {
        expect(this.winstonErrorStub).to.have.been.calledOnce
        expect(this.winstonErrorStub).to.have.been.calledWith(this.error)
      })

      it('should not log info level message to logger', () => {
        expect(this.winstonInfoStub).not.to.have.been.called
      })

      it('should not call next', () => {
        expect(this.nextSpy).not.to.have.been.called
      })
    })

    context('with a 500 error status code', () => {
      beforeEach(() => {
        this.error.statusCode = errorCode500
        this.errorsStub(isDev).catchAll(this.error, null, this.responseMock, this.nextSpy)
      })

      it('should set correct status code on response', () => {
        expect(this.statusStub).to.have.been.calledOnce
        expect(this.statusStub).to.have.been.calledWith(errorCode500)
      })

      it('should call the errors template', () => {
        expect(this.renderSpy).to.have.been.calledOnce
        expect(this.renderSpy.args[0][0]).to.equal('errors')
      })

      it('should pass correct values to template', () => {
        expect(this.renderSpy.args[0][1]).to.deep.equal({
          error: this.error,
          statusCode: errorCode500,
          statusMessage: 'Page unavailable',
          showStackTrace: true,
        })
      })

      it('should not render breadcrumbs', () => {
        expect(this.responseMock.locals.BREADCRUMBS).to.equal(null)
      })

      it('should log error level message to logger', () => {
        expect(this.winstonErrorStub).to.have.been.calledOnce
        expect(this.winstonErrorStub).to.have.been.calledWith(this.error)
      })

      it('should not log info level message to logger', () => {
        expect(this.winstonInfoStub).not.to.have.been.called
      })

      it('should not call next', () => {
        expect(this.nextSpy).not.to.have.been.called
      })
    })

    context('with no error status code', () => {
      beforeEach(() => {
        this.statusCode = 500
        this.errorsStub(isDev).catchAll(this.error, null, this.responseMock, this.nextSpy)
      })

      it('should set correct status code on response', () => {
        expect(this.statusStub).to.have.been.calledOnce
        expect(this.statusStub).to.have.been.calledWith(this.statusCode)
      })

      it('should call the errors template', () => {
        expect(this.renderSpy).to.have.been.calledOnce
        expect(this.renderSpy.args[0][0]).to.equal('errors')
      })

      it('should pass correct values to template', () => {
        expect(this.renderSpy.args[0][1]).to.deep.equal({
          error: this.error,
          statusCode: this.statusCode,
          statusMessage: 'Page unavailable',
          showStackTrace: true,
        })
      })

      it('should not render breadcrumbs', () => {
        expect(this.responseMock.locals.BREADCRUMBS).to.equal(null)
      })

      it('should log error level message to logger', () => {
        expect(this.winstonErrorStub).to.have.been.calledOnce
        expect(this.winstonErrorStub).to.have.been.calledWith(this.error)
      })

      it('should not log info level message to logger', () => {
        expect(this.winstonInfoStub).not.to.have.been.called
      })

      it('should not call next', () => {
        expect(this.nextSpy).not.to.have.been.called
      })
    })
  })
})
