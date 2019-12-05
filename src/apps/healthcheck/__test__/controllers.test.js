const proxyquire = require('proxyquire')

describe('Health check controller', () => {
  describe('#getMicroserviceHealthcheck with healthy service dependencies', () => {
    beforeEach(() => {
      this.serviceDependencies = [
        {
          name: 'success',
          healthCheck: () => {
            return Promise.resolve({ statusText: 'OK' })
          },
        },
      ]
      this.logger = sinon.stub().returns({ error: sinon.spy() })
      this.controller = proxyquire.noCallThru().load('../controllers', {
        './serviceDependencies': this.serviceDependencies,
        '../../../config/logger': this.logger,
      })
      this.req = {}
      this.res = {
        set: sinon.spy(),
        status: sinon.stub().returns({
          send: sinon.spy(),
        }),
      }
      this.next = sinon.spy()
    })

    it('should set cache control', async () => {
      await this.controller.getMicroserviceHealthcheck(this.req, this.res, this.next)

      expect(this.res.set).to.be.calledWith('Cache-Control', 'no-cache, no-store, must-revalidate')
      expect(this.res.set).to.have.been.calledOnce
    })

    it('should return a 200 status code', async () => {
      await this.controller.getMicroserviceHealthcheck(this.req, this.res, this.next)

      expect(this.res.status).to.be.calledWith(200)
      expect(this.res.status).to.have.been.calledOnce
    })

    it('should return OK', async () => {
      await this.controller.getMicroserviceHealthcheck(this.req, this.res, this.next)

      expect(this.res.status().send).to.be.calledWith('OK')
      expect(this.res.status().send).to.have.been.calledOnce
    })

    it('should not call the logger', async () => {
      await this.controller.getMicroserviceHealthcheck(this.req, this.res, this.next)

      expect(this.logger().error.notCalled).to.be.true
    })
  })

  describe('#getMicroserviceHealthcheck with unhealthy service dependencies', () => {
    beforeEach(() => {
      this.serviceDependencyError = { name: 'example service dependency', error: Error('example error') }
      this.serviceDependencies = [
        {
          name: 'failure',
          healthCheck: () => {
            return Promise.resolve(this.serviceDependencyError)
          },
        },
      ]
      this.logger = { error: sinon.spy() }
      this.controller = proxyquire.noCallThru().load('../controllers', {
        './serviceDependencies': this.serviceDependencies,
        '../../config/logger': this.logger,
      })
      this.req = {}
      this.res = {
        set: sinon.spy(),
        status: sinon.stub().returns({
          send: sinon.spy(),
        }),
      }
      this.next = sinon.spy()
    })

    it('should set cache control', async () => {
      await this.controller.getMicroserviceHealthcheck(this.req, this.res, this.next)

      expect(this.res.set).to.be.calledWith('Cache-Control', 'no-cache, no-store, must-revalidate')
      expect(this.res.set).to.have.been.calledOnce
    })

    it('should return a 503 status code', async () => {
      await this.controller.getMicroserviceHealthcheck(this.req, this.res, this.next)

      expect(this.res.status).to.be.calledWith(503)
      expect(this.res.status).to.have.been.calledOnce
    })

    it('should return Service Unavailable', async () => {
      await this.controller.getMicroserviceHealthcheck(this.req, this.res, this.next)

      expect(this.res.status().send).to.be.calledWith('Service Unavailable')
      expect(this.res.status().send).to.have.been.calledOnce
    })

    it('should call the logger', async () => {
      await this.controller.getMicroserviceHealthcheck(this.req, this.res, this.next)

      expect(this.logger.error).to.have.been.calledOnce
      expect(this.logger.error).to.be.calledWith(
        `${this.serviceDependencyError.name} health check failed`,
        this.serviceDependencyError.error
      )
    })
  })

  describe('#renderPingdomXml with healthy service dependencies', () => {
    beforeEach(() => {
      this.serviceDependencies = [
        {
          name: 'success',
          healthCheck: () => {
            return Promise.resolve({ statusText: 'OK' })
          },
        },
      ]
      this.logger = sinon.stub().returns({ error: sinon.spy() })
      this.controller = proxyquire.noCallThru().load('../controllers', {
        './serviceDependencies': this.serviceDependencies,
        '../../../config/logger': this.logger,
      })
      this.req = {}
      this.res = {
        set: sinon.spy(),
        status: sinon.stub().returns({
          send: sinon.spy(),
        }),
      }
      this.next = sinon.spy()
    })

    it('should set content type and cache control', async () => {
      await this.controller.renderPingdomXml(this.req, this.res, this.next)

      expect(this.res.set).to.be.calledWith({
        'Content-Type': 'text/xml',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
      })
      expect(this.res.set).to.have.been.calledOnce
    })

    it('should return a 200 status code', async () => {
      await this.controller.renderPingdomXml(this.req, this.res, this.next)

      expect(this.res.status).to.be.calledWith(200)
      expect(this.res.status).to.have.been.calledOnce
    })

    it('should return OK', async () => {
      await this.controller.renderPingdomXml(this.req, this.res, this.next)

      expect(this.res.status().send.args[0][0]).to.contain('OK')
      expect(this.res.status().send.args[0][0]).to.not.contain('Service Unavailable')
    })

    it('should not call the logger', async () => {
      await this.controller.renderPingdomXml(this.req, this.res, this.next)

      expect(this.logger().error.notCalled).to.be.true
    })
  })

  describe('#renderPingdomXml with unhealthy service dependencies', () => {
    beforeEach(() => {
      this.serviceDependencyError = { name: 'example service dependency', error: Error('example error') }
      this.serviceDependencies = [
        {
          name: 'failure',
          healthCheck: () => {
            return Promise.resolve(this.serviceDependencyError)
          },
        },
      ]
      this.logger = { error: sinon.spy() }
      this.controller = proxyquire.noCallThru().load('../controllers', {
        './serviceDependencies': this.serviceDependencies,
        '../../config/logger': this.logger,
      })
      this.req = {}
      this.res = {
        set: sinon.spy(),
        status: sinon.stub().returns({
          send: sinon.spy(),
        }),
      }
      this.next = sinon.spy()
    })

    it('should set content type and cache control', async () => {
      await this.controller.renderPingdomXml(this.req, this.res, this.next)

      expect(this.res.set).to.be.calledWith({
        'Content-Type': 'text/xml',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
      })
      expect(this.res.set).to.have.been.calledOnce
    })

    it('should return a 503 status code', async () => {
      await this.controller.renderPingdomXml(this.req, this.res, this.next)

      expect(this.res.status).to.be.calledWith(503)
      expect(this.res.status).to.have.been.calledOnce
    })

    it('should return Service Unavailable', async () => {
      await this.controller.renderPingdomXml(this.req, this.res, this.next)

      expect(this.res.status().send.args[0][0]).to.contain('Service Unavailable')
      expect(this.res.status().send.args[0][0]).to.not.contain('OK')
    })

    it('should call the logger', async () => {
      await this.controller.renderPingdomXml(this.req, this.res, this.next)

      expect(this.logger.error).to.have.been.calledOnce
      expect(this.logger.error).to.be.calledWith(
        `${this.serviceDependencyError.name} health check failed`,
        this.serviceDependencyError.error
      )
    })
  })
})
