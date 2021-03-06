const proxyquire = require('proxyquire')

const successDependencies = [
  {
    name: 'success',
    healthCheck: () => {
      return Promise.resolve({ statusText: 'OK' })
    },
  },
]

const serviceDependencyError = {
  name: 'example service dependency',
  error: Error('example error'),
}

const failureDependencies = [
  {
    name: 'failure',
    healthCheck: () => {
      return Promise.resolve(serviceDependencyError)
    },
  },
]

const warningDependencies = [
  {
    name: 'warning',
    warningOnly: true,
    healthCheck: () => {
      return Promise.resolve(serviceDependencyError)
    },
  },
]

const callNamedHandler = async (handlerName, dependencies) => {
  const logger = { error: sinon.spy() }
  const controller = proxyquire.noCallThru().load('../controllers', {
    './serviceDependencies': dependencies,
    '../../../config/logger': logger,
  })
  const req = {}
  const res = {
    set: sinon.spy(),
    status: sinon.stub().returns({
      send: sinon.spy(),
    }),
  }
  const next = sinon.spy()
  const handler = controller[handlerName]
  await handler(req, res, next)
  return {
    logger,
    res,
  }
}

const getMicroserviceHealthcheck = async (dependencies) => {
  return callNamedHandler('getMicroserviceHealthcheck', dependencies)
}

const getPingdomFailures = async (dependencies) => {
  return callNamedHandler('getPingdomFailures', dependencies)
}

const getPingdomWarnings = async (dependencies) => {
  return callNamedHandler('getPingdomWarnings', dependencies)
}

describe('Health check controller', () => {
  describe('#getMicroserviceHealthcheck with healthy service dependencies', () => {
    it('should set cache control', async () => {
      const { res } = await getMicroserviceHealthcheck(successDependencies)

      expect(res.set).to.be.calledWith(
        'Cache-Control',
        'no-cache, no-store, must-revalidate'
      )
      expect(res.set).to.have.been.calledOnce
    })

    it('should return a 200 status code', async () => {
      const { res } = await getMicroserviceHealthcheck(successDependencies)

      expect(res.status).to.be.calledWith(200)
      expect(res.status).to.have.been.calledOnce
    })

    it('should return OK', async () => {
      const { res } = await getMicroserviceHealthcheck(successDependencies)

      expect(res.status().send).to.be.calledWith('OK')
      expect(res.status().send).to.have.been.calledOnce
    })

    it('should not call the logger', async () => {
      const { logger } = await getMicroserviceHealthcheck(successDependencies)

      expect(logger.error.notCalled).to.be.true
    })
  })

  // getMicroserviceHealthcheck() ought NOT check dependencies
  describe('#getMicroserviceHealthcheck with unhealthy service dependencies', () => {
    it('should set cache control', async () => {
      const { res } = await getMicroserviceHealthcheck(failureDependencies)

      expect(res.set).to.be.calledWith(
        'Cache-Control',
        'no-cache, no-store, must-revalidate'
      )
      expect(res.set).to.have.been.calledOnce
    })

    it('should return a 200 status code', async () => {
      const { res } = await getMicroserviceHealthcheck(failureDependencies)

      expect(res.status).to.be.calledWith(200)
      expect(res.status).to.have.been.calledOnce
    })

    it('should return OK', async () => {
      const { res } = await getMicroserviceHealthcheck(failureDependencies)

      expect(res.status().send).to.be.calledWith('OK')
      expect(res.status().send).to.have.been.calledOnce
    })

    it('should not call the logger', async () => {
      const { logger } = await getMicroserviceHealthcheck(failureDependencies)

      expect(logger.error.notCalled).to.be.true
    })
  })

  describe('#getPingdomFailures with healthy service dependencies', () => {
    it('should set content type and cache control', async () => {
      const { res } = await getPingdomFailures(successDependencies)

      expect(res.set).to.be.calledWith({
        'Content-Type': 'text/xml',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
      })
      expect(res.set).to.have.been.calledOnce
    })

    it('should return a 200 status code', async () => {
      const { res } = await getPingdomFailures(successDependencies)

      expect(res.status).to.be.calledWith(200)
      expect(res.status).to.have.been.calledOnce
    })

    it('should return OK', async () => {
      const { res } = await getPingdomFailures(successDependencies)

      expect(res.status().send.args[0][0]).to.contain('OK')
      expect(res.status().send.args[0][0]).to.not.contain('Service Unavailable')
    })

    it('should not call the logger', async () => {
      const { logger } = await getPingdomFailures(successDependencies)

      expect(logger.error.notCalled).to.be.true
    })
  })

  describe('#getPingdomFailures with unhealthy service dependencies', () => {
    it('should set content type and cache control', async () => {
      const { res } = await getPingdomFailures(failureDependencies)

      expect(res.set).to.be.calledWith({
        'Content-Type': 'text/xml',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
      })
      expect(res.set).to.have.been.calledOnce
    })

    it('should return a 503 status code', async () => {
      const { res } = await getPingdomFailures(failureDependencies)

      expect(res.status).to.be.calledWith(503)
      expect(res.status).to.have.been.calledOnce
    })

    it('should return Service Unavailable', async () => {
      const { res } = await getPingdomFailures(failureDependencies)

      expect(res.status().send.args[0][0]).to.contain('Service Unavailable')
      expect(res.status().send.args[0][0]).to.not.contain('OK')
    })

    it('should call the logger', async () => {
      const { logger } = await getPingdomFailures(failureDependencies)

      expect(logger.error.calledOnce)
      expect(
        logger.error.calledWith(
          `${serviceDependencyError.name} health check failed`,
          serviceDependencyError.error
        )
      )
    })
  })

  describe('#getPingdomFailures with unhealthy "warning only" service dependencies', () => {
    it('should set content type and cache control', async () => {
      const { res } = await getPingdomFailures(warningDependencies)

      expect(res.set).to.be.calledWith({
        'Content-Type': 'text/xml',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
      })
      expect(res.set).to.have.been.calledOnce
    })

    it('should return a 200 status code', async () => {
      const { res } = await getPingdomFailures(warningDependencies)

      expect(res.status).to.be.calledWith(200)
      expect(res.status).to.have.been.calledOnce
    })

    it('should return OK', async () => {
      const { res } = await getPingdomFailures(warningDependencies)

      expect(res.status().send.args[0][0]).to.contain('OK')
      expect(res.status().send.args[0][0]).to.not.contain('Service Unavailable')
    })

    it('should not call the logger', async () => {
      const { logger } = await getPingdomFailures(warningDependencies)

      expect(logger.error.notCalled).to.be.true
    })
  })

  describe('#getPingdomWarnings with unhealthy "warning only" service dependencies', () => {
    it('should set content type and cache control', async () => {
      const { res } = await getPingdomWarnings(warningDependencies)

      expect(res.set).to.be.calledWith({
        'Content-Type': 'text/xml',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
      })
      expect(res.set).to.have.been.calledOnce
    })

    it('should return a 503 status code', async () => {
      const { res } = await getPingdomWarnings(warningDependencies)

      expect(res.status).to.be.calledWith(503)
      expect(res.status).to.have.been.calledOnce
    })

    it('should return Service Unavailable', async () => {
      const { res } = await getPingdomWarnings(warningDependencies)

      expect(res.status().send.args[0][0]).to.contain('Service Unavailable')
      expect(res.status().send.args[0][0]).to.not.contain('OK')
    })

    it('should call the logger', async () => {
      const { logger } = await getPingdomWarnings(warningDependencies)

      expect(logger.error.calledOnce)
      expect(
        logger.error.calledWith(
          `${serviceDependencyError.name} health check failed`,
          serviceDependencyError.error
        )
      )
    })
  })

  describe('#getPingdomWarnings with unhealthy primary service dependencies', () => {
    // "primary" denoting NOT "warning only"
    it('should set content type and cache control', async () => {
      const { res } = await getPingdomWarnings(failureDependencies)

      expect(res.set).to.be.calledWith({
        'Content-Type': 'text/xml',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
      })
      expect(res.set).to.have.been.calledOnce
    })

    it('should return a 200 status code', async () => {
      const { res } = await getPingdomWarnings(failureDependencies)

      expect(res.status).to.be.calledWith(200)
      expect(res.status).to.have.been.calledOnce
    })

    it('should return OK', async () => {
      const { res } = await getPingdomWarnings(failureDependencies)

      expect(res.status().send.args[0][0]).to.contain('OK')
      expect(res.status().send.args[0][0]).to.not.contain('Service Unavailable')
    })

    it('should not call the logger', async () => {
      const { logger } = await getPingdomWarnings(failureDependencies)

      expect(logger.error.notCalled).to.be.true
    })
  })
})
