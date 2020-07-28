const winston = require('winston')

const config = require('./')

const loggingTransports = []
const exceptionTransports = []

loggingTransports.push(
  new winston.transports.Console({
    level: config.logLevel,
    json: false,
    colorize: true,
    handleExceptions: true,
    humanReadableUnhandledException: true,
  })
)

if (config.isProd) {
  exceptionTransports.push(
    new winston.transports.Console({
      json: true,
      timestamp: true,
      colorize: false,
      stringify: true,
    })
  )
}

const logger = winston.createLogger({
  format: winston.format.combine(winston.format.cli()),
  transports: loggingTransports,
  exceptionHandlers: exceptionTransports,
  exitOnError: true,
})

module.exports = logger
