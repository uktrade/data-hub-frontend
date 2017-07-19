const winston = require('winston')

const config = require('./')

const loggingTransports = []
const exceptionTransports = []

loggingTransports.push(new (winston.transports.Console)({
  level: config.logLevel,
  json: false,
  colorize: true,
  handleExceptions: true,
  humanReadableUnhandledException: true,
}))

if (config.env === 'production') {
  // TODO: add a transport to log errors in service like Sentry
  // before we go live with real users
  exceptionTransports.push(
    new (winston.transports.Console)({
      json: true,
      timestamp: true,
      colorize: false,
      stringify: true,
    })
  )
}

const logger = new (winston.Logger)({
  transports: loggingTransports,
  exceptionHandlers: exceptionTransports,
  exitOnError: true,
})
logger.cli()

module.exports = logger
