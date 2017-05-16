const proxyquire = require('proxyquire')
const winston = require('winston')

const errorCode404 = 404
const errorCode500 = 500
const isDev = true
const errorsStub = (isDev) => {
  return proxyquire('../../src/middleware/errors', {
    '../config': {
      isDev
    }
  })
}

let winstonErrorStub
let winstonInfoStub

before(function () {
  winstonErrorStub = sinon.stub(winston, 'error')
  winstonInfoStub = sinon.stub(winston, 'info')
})

after(function () {
  winston.error.restore()
  winston.info.restore()
})

describe('Error Middleware Test', function () {
  describe('notFound method', function () {
    it('should log a 404 and drop through to next middleware', function (done) {
      const nextSpy = sinon.spy()

      errorsStub(isDev).notFound(null, null, nextSpy)

      expect(nextSpy.calledOnce).to.be.true
      expect(nextSpy.args[0][0] instanceof Error).to.be.true
      expect(nextSpy.args[0][0].message).to.equal('Not Found')
      expect(nextSpy.args[0][0].status).to.equal(404)
      done()
    })
  })

  describe('catchAll method', function () {
    it('should log a 404 and render response', function (done) {
      const nextSpy = sinon.spy()
      const responseRenderSpy = sinon.spy()
      const mockResponse = {
        status: () => {
          return {
            render: responseRenderSpy
          }
        },
        headersSent: false
      }
      const responseStatusSpy = sinon.spy(mockResponse, 'status')
      const error = new Error(`mock ${errorCode404} error`)

      error.status = errorCode404
      errorsStub(isDev).catchAll(error, null, mockResponse, nextSpy)

      expect(responseStatusSpy.calledOnce).to.be.true
      expect(responseStatusSpy.args[0][0]).to.equal(errorCode404)
      expect(responseRenderSpy.calledOnce).to.be.true
      expect(responseRenderSpy.args[0][0]).to.equal('errors/index')
      expect(responseRenderSpy.args[0][1]).to.eql({
        'devErrorDetail': error,
        'statusCode': errorCode404,
        'statusMessage': 'Sorry we couldn\'t find that page!'
      })
      expect(winstonInfoStub.args[0][0] instanceof Error).to.be.true
      expect(winstonInfoStub.args[0][0].message).to.equal(`mock ${errorCode404} error`)
      expect(winstonInfoStub.args[0][0].status).to.equal(errorCode404)
      done()
    })

    it('should log a 500 and render response', function (done) {
      const nextSpy = sinon.spy()
      const responseRenderSpy = sinon.spy()
      const mockResponse = {
        status: () => {
          return {
            render: responseRenderSpy
          }
        },
        headersSent: false
      }
      const responseStatusSpy = sinon.spy(mockResponse, 'status')
      const error = new Error(`mock ${errorCode500} error`)

      errorsStub(isDev).catchAll(error, null, mockResponse, nextSpy)

      expect(responseStatusSpy.calledOnce).to.be.true
      expect(responseStatusSpy.args[0][0]).to.equal(errorCode500)
      expect(responseRenderSpy.calledOnce).to.be.true
      expect(responseRenderSpy.args[0][0]).to.equal('errors/index')
      expect(responseRenderSpy.args[0][1]).to.eql({
        'devErrorDetail': error,
        'statusCode': errorCode500,
        'statusMessage': 'Sorry something has gone wrong!'
      })
      expect(winstonErrorStub.args[0][0] instanceof Error).to.be.true
      expect(winstonErrorStub.args[0][0].message).to.equal(`mock ${errorCode500} error`)
      expect(winstonErrorStub.args[0][0].status).to.equal(errorCode500)
      done()
    })

    it('should log a 500 and render response without error information', function (done) {
      const nextSpy = sinon.spy()
      const responseRenderSpy = sinon.spy()
      const mockResponse = {
        status: () => {
          return {
            render: responseRenderSpy
          }
        },
        headersSent: false
      }
      const responseStatusSpy = sinon.spy(mockResponse, 'status')
      const error = new Error(`mock ${errorCode500} error`)

      errorsStub(!isDev).catchAll(error, null, mockResponse, nextSpy)

      expect(responseStatusSpy.calledOnce).to.be.true
      expect(responseStatusSpy.args[0][0]).to.equal(errorCode500)
      expect(responseRenderSpy.calledOnce).to.be.true
      expect(responseRenderSpy.args[0][0]).to.equal('errors/index')
      expect(responseRenderSpy.args[0][1]).to.eql({
        'devErrorDetail': false,
        'statusCode': errorCode500,
        'statusMessage': 'Sorry something has gone wrong!'
      })
      expect(winstonErrorStub.args[0][0] instanceof Error).to.be.true
      expect(winstonErrorStub.args[0][0].message).to.equal(`mock ${errorCode500} error`)
      expect(winstonErrorStub.args[0][0].status).to.equal(errorCode500)
      done()
    })

    it('should drop through to next middleware as headers have already been sent', function (done) {
      const nextSpy = sinon.spy()
      const mockResponse = {
        headersSent: true
      }
      const error = new Error('mock headers sent error')

      errorsStub(isDev).catchAll(error, null, mockResponse, nextSpy)

      expect(nextSpy.args[0][0] instanceof Error).to.be.true
      expect(nextSpy.args[0][0].message).to.equal('mock headers sent error')
      expect(nextSpy.args[0][0].status).to.equal(errorCode500)
      done()
    })
  })
})
