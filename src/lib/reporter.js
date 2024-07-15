const Sentry = require('@sentry/node')

const config = require('../config')
const logger = require('../config/logger')

const useSentry = !!config.sentryDsn

if (useSentry) {
  logger.info('Sentry DSN detected. Sentry will be enabled.', {
    eventType: logger.eventTypes.expressStartup,
  })
  Sentry.init({
    dsn: config.sentryDsn,
  })
}

module.exports = {
  levels: {
    debug: 'debug',
    info: 'info',
    warning: 'warning',
    error: 'error',
    fatal: 'fatal',
  },

  setup: function (app) {
    if (useSentry) {
      Sentry.setupExpressErrorHandler(app)
    }
  },

  message: function (level, msg, extra) {
    if (useSentry) {
      Sentry.captureMessage(msg, {
        level,
        extra,
      })
    } else {
      logger.warn(msg)
      if (extra) {
        logger.warn(extra)
      }
    }
  },

  captureException: function (err, extra) {
    if (useSentry) {
      Sentry.captureException(err, { extra })
    } else {
      logger.error(err.stack)
      if (extra) {
        logger.error(extra)
      }
    }
  },
}
