const proxyquire = require('proxyquire')
const stdMocks = require('std-mocks')

const config = require('../index')

describe('Logger transport check', () => {
  let expectedInfo = {
    EventMessage: 'Drum roll for info',
    EventCount: 1,
    EventType: 'express.startup',
    EventResult: 'NA',
    EventSeverity: 'Informational',
    EventOriginalSeverity: 'info',
    EventSchema: 'ProcessEvent',
    EventSchemaVersion: '0.1.4',
    ActingAppType: 'Express',
    AdditionalFields: { CustomASIMFormatter: true, TraceHeaders: {} },
  }
  let expectedError = {
    EventMessage: 'Failed roll error',
    EventCount: 1,
    EventType: 'express.request',
    EventResult: 'NA',
    EventSeverity: 'Medium',
    EventOriginalSeverity: 'error',
    EventSchema: 'ProcessEvent',
    EventSchemaVersion: '0.1.4',
    ActingAppType: 'Express',
    AdditionalFields: { CustomASIMFormatter: true, TraceHeaders: {} },
  }

  describe('In production environment', () => {
    beforeEach(() => {
      process.env.LOG_LEVEL = 'info'
      proxyquire.noPreserveCache()
      sinon.stub(config, 'isProd').value('true')
      this.logger = proxyquire('../logger', {})
    })

    it('Logger return ASIMFormat for production environment info', () => {
      stdMocks.use()
      this.logger.info('Drum roll for info', {
        eventType: this.logger.eventTypes.expressStartup,
      })
      stdMocks.restore()
      const output = stdMocks.flush()
      const entries = output.stdout.map((line) => JSON.parse(line))

      expect(entries[0]).to.containSubset(expectedInfo)
      const transports = this.logger.transports
      expect(transports).is.an('array')
      expect(transports).length(2)
    })

    it('Logger return ASIMFormat for production environment error', () => {
      stdMocks.use()
      this.logger.error('Failed roll error', {
        eventType: this.logger.eventTypes.expressRequest,
      })
      stdMocks.restore()
      const output = stdMocks.flush()
      const entries = output.stdout.map((line) => JSON.parse(line))

      expect(entries[0]).to.containSubset(expectedError)
      const transports = this.logger.transports
      expect(transports).is.an('array')
      expect(transports).length(2)
    })
  })

  describe('In non production environments', () => {
    beforeEach(() => {
      proxyquire.noPreserveCache()
      this.logger = proxyquire('../logger', {})
      this.logger.silent = false
    })
    it('Logger return plain format for non production environment info', () => {
      stdMocks.use()
      this.logger.info('Drum roll for info', {
        eventType: this.logger.eventTypes.expressStartup,
      })
      stdMocks.restore()
      const output = stdMocks.flush()

      expect(output.stdout).to.containSubset([
        '\x1B[32minfo\x1B[39m: \x1B[32mDrum roll for info\x1B[39m {"eventType":"express.startup"}\n',
      ])
      const transports = this.logger.transports
      expect(transports).is.an('array')
      expect(transports).length(1)
    })
    it('Logger return plain format for non production environment error', () => {
      stdMocks.use()
      this.logger.error('Failed roll error', {
        eventType: this.logger.eventTypes.expressRequest,
      })
      stdMocks.restore()
      const output = stdMocks.flush()

      expect(output.stdout).to.containSubset([
        '\x1B[31merror\x1B[39m: \x1B[31mFailed roll error\x1B[39m {"eventType":"express.request"}\n',
      ])
      const transports = this.logger.transports
      expect(transports).is.an('array')
      expect(transports).length(1)
    })
  })
})
