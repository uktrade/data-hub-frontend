const proxyquire = require('proxyquire')
const stdMocks = require('std-mocks')

const config = require('../index')

describe('Logger transport check', () => {
  let expectedInfo = {
    EventMessage: 'Message for info',
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
  let expectedWarning = {
    EventMessage: 'Mind yourself for the warning',
    EventCount: 1,
    EventType: 'express.startup',
    EventResult: 'NA',
    EventSeverity: 'Low',
    EventOriginalSeverity: 'warn',
    EventSchema: 'ProcessEvent',
    EventSchemaVersion: '0.1.4',
    ActingAppType: 'Express',
    AdditionalFields: { CustomASIMFormatter: true, TraceHeaders: {} },
  }
  let expectedError = {
    EventMessage: 'An error occurred',
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
  let expectedLog = {
    EventMessage: 'A logged line',
    EventCount: 1,
    EventType: 'express.request',
    EventResult: 'NA',
    EventSeverity: 'Informational',
    EventOriginalSeverity: 'info',
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

    it('Logger return ASIMFormat for production environment', () => {
      stdMocks.use()
      this.logger.info('Message for info', {
        eventType: this.logger.eventTypes.expressStartup,
      })
      this.logger.warn('Mind yourself for the warning', {
        eventType: this.logger.eventTypes.expressStartup,
      })
      this.logger.error('An error occurred', {
        eventType: this.logger.eventTypes.expressRequest,
      })
      this.logger.log('info', 'A logged line', {
        eventType: this.logger.eventTypes.expressRequest,
      })
      stdMocks.restore()
      const output = stdMocks.flush()
      const entries = output.stdout.map((line) => JSON.parse(line))

      expect(entries[0]).to.containSubset(expectedInfo)
      expect(entries[1]).to.containSubset(expectedWarning)
      expect(entries[2]).to.containSubset(expectedError)
      expect(entries[3]).to.containSubset(expectedLog)
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
    it('Logger return plain format for non production environment', () => {
      stdMocks.use()
      this.logger.info('Drum roll for info', {
        eventType: this.logger.eventTypes.expressStartup,
      })
      this.logger.warn('It is a warning', {
        eventType: this.logger.eventTypes.expressStartup,
      })
      this.logger.error('Failed roll error', {
        eventType: this.logger.eventTypes.expressRequest,
      })
      stdMocks.restore()
      const output = stdMocks.flush()

      expect(output.stdout).to.containSubset([
        '\x1B[32minfo\x1B[39m: \x1B[32mDrum roll for info\x1B[39m {"eventType":"express.startup"}\n',
        '\x1B[33mwarn\x1B[39m: \x1B[33mIt is a warning\x1B[39m {"eventType":"express.startup"}\n',
        '\x1B[31merror\x1B[39m: \x1B[31mFailed roll error\x1B[39m {"eventType":"express.request"}\n',
      ])
      const transports = this.logger.transports
      expect(transports).is.an('array')
      expect(transports).length(1)
    })
  })
})
