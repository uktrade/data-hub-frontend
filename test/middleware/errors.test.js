const proxyquire = require('proxyquire')
const winston = require('winston')

const errorCode404 = 404
const errorCode403 = 403
const errorCode500 = 500
const isDev = true

describe('Error Middleware Test', () => {
  beforeEach(() => {
    this.sandbox = sinon.sandbox.create()
    this.winstonErrorStub = this.sandbox.stub(winston, 'error')
    this.winstonInfoStub = this.sandbox.stub(winston, 'info')

    this.errorsStub = (isDev) => {
      return proxyquire('../../src/middleware/errors', {
        '../config': {
          isDev
        }
      })
    }
  })

  afterEach(() => {
    this.sandbox.restore()
  })

  describe('notFound method', () => {
    it('should log a 404 and drop through to next middleware', () => {
      const nextSpy = this.sandbox.spy()

      this.errorsStub(isDev).notFound(null, null, nextSpy)

      expect(nextSpy.calledOnce).to.be.true
      expect(nextSpy.args[0][0] instanceof Error).to.be.true
      expect(nextSpy.args[0][0].message).to.equal('Not Found')
      expect(nextSpy.args[0][0].statusCode).to.equal(404)
    })
  })

  describe('catchAll method', () => {
    it('should log a 404 and render response', () => {
      const nextSpy = this.sandbox.spy()
      const responseRenderSpy = this.sandbox.spy()
      const mockResponse = {
        status: () => {
          return {
            render: responseRenderSpy
          }
        },
        headersSent: false
      }
      const responsestatusCodeSpy = this.sandbox.spy(mockResponse, 'status')
      const error = new Error(`mock ${errorCode404} error`)

      error.statusCode = errorCode404
      this.errorsStub(isDev).catchAll(error, null, mockResponse, nextSpy)

      expect(responsestatusCodeSpy.calledOnce).to.be.true
      expect(responsestatusCodeSpy.args[0][0]).to.equal(errorCode404)
      expect(responseRenderSpy.calledOnce).to.be.true
      expect(responseRenderSpy.args[0][0]).to.equal('errors/index')
      expect(responseRenderSpy.args[0][1]).to.eql({
        'devErrorDetail': error,
        'statusCode': errorCode404,
        'statusMessage': 'Sorry we couldn\'t find that page!'
      })
      expect(this.winstonInfoStub.args[0][0] instanceof Error).to.be.true
      expect(this.winstonInfoStub.args[0][0].message).to.equal(`mock ${errorCode404} error`)
      expect(this.winstonInfoStub.args[0][0].statusCode).to.equal(errorCode404)
    })

    it('should log a 500 and render response', () => {
      const nextSpy = this.sandbox.spy()
      const responseRenderSpy = this.sandbox.spy()
      const mockResponse = {
        status: () => {
          return {
            render: responseRenderSpy
          }
        },
        headersSent: false
      }
      const responsestatusCodeSpy = this.sandbox.spy(mockResponse, 'status')
      const error = new Error(`mock ${errorCode500} error`)

      this.errorsStub(isDev).catchAll(error, null, mockResponse, nextSpy)

      expect(responsestatusCodeSpy.calledOnce).to.be.true
      expect(responsestatusCodeSpy.args[0][0]).to.equal(errorCode500)
      expect(responseRenderSpy.calledOnce).to.be.true
      expect(responseRenderSpy.args[0][0]).to.equal('errors/index')
      expect(responseRenderSpy.args[0][1]).to.eql({
        'devErrorDetail': error,
        'statusCode': errorCode500,
        'statusMessage': 'Sorry something has gone wrong!'
      })
      expect(this.winstonErrorStub.args[0][0] instanceof Error).to.be.true
      expect(this.winstonErrorStub.args[0][0].message).to.equal(`mock ${errorCode500} error`)
      expect(this.winstonErrorStub.args[0][0].statusCode).to.equal(errorCode500)
    })

    it('should log a 403 and render response', () => {
      const nextSpy = this.sandbox.spy()
      const responseRenderSpy = this.sandbox.spy()
      const mockResponse = {
        status: () => {
          return {
            render: responseRenderSpy
          }
        },
        headersSent: false
      }
      const responsestatusCodeSpy = this.sandbox.spy(mockResponse, 'status')
      const error = new Error(`mock ${errorCode403} error`)

      error.statusCode = errorCode403
      error.code = 'EBADCSRFTOKEN'

      this.errorsStub(isDev).catchAll(error, null, mockResponse, nextSpy)

      expect(responsestatusCodeSpy.calledOnce).to.be.true
      expect(responsestatusCodeSpy.args[0][0]).to.equal(errorCode403)
      expect(responseRenderSpy.calledOnce).to.be.true
      expect(responseRenderSpy.args[0][0]).to.equal('errors/index')
      expect(responseRenderSpy.args[0][1]).to.eql({
        'devErrorDetail': error,
        'statusCode': errorCode403,
        'statusMessage': 'This form has been tampered with'
      })
      expect(this.winstonErrorStub.args[0][0] instanceof Error).to.be.true
      expect(this.winstonErrorStub.args[0][0].message).to.equal(`mock ${errorCode403} error`)
      expect(this.winstonErrorStub.args[0][0].statusCode).to.equal(errorCode403)
      expect(nextSpy.calledOnce).to.be.false
    })

    it('should log a 500 and render response without error information', () => {
      const nextSpy = this.sandbox.spy()
      const responseRenderSpy = this.sandbox.spy()
      const mockResponse = {
        status: () => {
          return {
            render: responseRenderSpy
          }
        },
        headersSent: false
      }
      const responsestatusCodeSpy = this.sandbox.spy(mockResponse, 'status')
      const error = new Error(`mock ${errorCode500} error`)

      this.errorsStub(!isDev).catchAll(error, null, mockResponse, nextSpy)

      expect(responsestatusCodeSpy.calledOnce).to.be.true
      expect(responsestatusCodeSpy.args[0][0]).to.equal(errorCode500)
      expect(responseRenderSpy.calledOnce).to.be.true
      expect(responseRenderSpy.args[0][0]).to.equal('errors/index')
      expect(responseRenderSpy.args[0][1]).to.eql({
        'devErrorDetail': false,
        'statusCode': errorCode500,
        'statusMessage': 'Sorry something has gone wrong!'
      })
      expect(this.winstonErrorStub.args[0][0] instanceof Error).to.be.true
      expect(this.winstonErrorStub.args[0][0].message).to.equal(`mock ${errorCode500} error`)
      expect(this.winstonErrorStub.args[0][0].statusCode).to.equal(errorCode500)
    })

    it('should drop through to next middleware as headers have already been sent', () => {
      const nextSpy = this.sandbox.spy()
      const mockResponse = {
        headersSent: true
      }
      const error = new Error('mock headers sent error')

      this.errorsStub(isDev).catchAll(error, null, mockResponse, nextSpy)

      expect(nextSpy.args[0][0] instanceof Error).to.be.true
      expect(nextSpy.args[0][0].message).to.equal('mock headers sent error')
      expect(nextSpy.args[0][0].statusCode).to.equal(errorCode500)
    })
  })
})
