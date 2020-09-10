const config = require('../config')
const raven = require('raven')
const logger = require('../config/logger')

const useSentry = !!config.sentryDsn

if (useSentry) {
  logger.info('Sentry DSN detected. Raven will be enabled.')
  // See https://docs.sentry.io/clients/node/config/
  // and https://docs.sentry.io/clients/node/usage/
  // for info on Raven config options
  raven
    .config(config.sentryDsn, {
      release: config.version,
      autoBreadcrumbs: true,
      captureUnhandledRejections: true,
    })
    .install()
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
      app.use(raven.requestHandler())
    }
  },

  handleErrors: function (app) {
    if (useSentry) {
      app.use(raven.errorHandler())
    }
  },

  message: function (level, msg, extra) {
    if (useSentry) {
      raven.captureMessage(msg, {
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
      raven.captureException(err, { extra })
    } else {
      logger.error(err.stack)
      if (extra) {
        logger.error(extra)
      }
    }
  },
}
