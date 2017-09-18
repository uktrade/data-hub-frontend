describe('Health check controller', () => {
  describe('#getHandler with healthy service dependencies', () => {
    beforeEach(() => {
      this.sandbox = sinon.sandbox.create()
      this.serviceDependencies = [
        {
          name: 'success',
          healthCheck: () => {
            return Promise.resolve({ statusText: 'OK' })
          },
        },
      ]
      this.logger = this.sandbox.stub().returns({ error: this.sandbox.spy() })
      this.controller = proxyquire.noCallThru().load('~/src/apps/healthcheck/controllers', {
        './serviceDependencies': this.serviceDependencies,
        '../../../config/logger': this.logger,
      })
      this.req = {}
      this.res = {
        set: this.sandbox.spy(),
        status: this.sandbox.stub().returns({
          send: this.sandbox.spy(),
        }),
      }
      this.next = this.sandbox.spy()
    })

    afterEach(() => {
      this.sandbox.restore()
    })

    it('should render the healthcheck page with OK response', async () => {
      await this.controller.getHandler(this.req, this.res, this.next)

      expect(this.res.set).to.be.calledWith('Cache-Control', 'no-cache, no-store, must-revalidate')
      expect(this.res.set).to.have.been.calledOnce
      expect(this.res.status).to.be.calledWith(200)
      expect(this.res.status).to.have.been.calledOnce
      expect(this.res.status().send).to.be.calledWith('OK')
      expect(this.res.status().send).to.have.been.calledOnce
      expect(this.logger.error).to.notCalled
    })
  })

  describe('#getHandler with unhealthy service dependencies', () => {
    beforeEach(() => {
      this.sandbox = sinon.sandbox.create()
      this.serviceDependencyError = { name: 'example service dependency', error: Error('example error') }
      this.serviceDependencies = [
        {
          name: 'failure',
          healthCheck: () => {
            return Promise.resolve(this.serviceDependencyError)
          },
        },
      ]
      this.logger = { error: this.sandbox.spy() }
      this.controller = proxyquire.noCallThru().load('~/src/apps/healthcheck/controllers', {
        './serviceDependencies': this.serviceDependencies,
        '../../../config/logger': this.logger,
      })
      this.req = {}
      this.res = {
        set: this.sandbox.spy(),
        status: this.sandbox.stub().returns({
          send: this.sandbox.spy(),
        }),
      }
      this.next = this.sandbox.spy()
    })

    afterEach(() => {
      this.sandbox.restore()
    })

    it('should render the healthcheck page with Service Unavailable response', async () => {
      await this.controller.getHandler(this.req, this.res, this.next)

      expect(this.res.set).to.be.calledWith('Cache-Control', 'no-cache, no-store, must-revalidate')
      expect(this.res.set).to.have.been.calledOnce
      expect(this.res.status).to.be.calledWith(503)
      expect(this.res.status).to.have.been.calledOnce
      expect(this.res.status().send).to.be.calledWith('Service Unavailable')
      expect(this.res.status().send).to.have.been.calledOnce
      expect(this.logger.error).to.have.been.calledOnce
      expect(this.logger.error).to.be.calledWith(
        `${this.serviceDependencyError.name} health check failed`,
        this.serviceDependencyError.error
      )
    })
  })
})
