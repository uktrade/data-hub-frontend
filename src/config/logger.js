const winston = require('winston')

const { createLogger, transports, format } = winston

const config = require('./')

const logger = createLogger({
  level: config.logLevel,
  exitOnError: true,
  transports: [
    new transports.Console({
      handleExceptions: true,
      humanReadableUnhandledException: true,
      format: format.combine(
        format.colorize({ all: true }),
        winston.format.splat(),
        format.simple()
      ),
    }),
  ],
})

if (config.isProd) {
  logger.exceptions.handle(
    new transports.Console({
      format: format.combine(format.timestamp(), format.json()),
    })
  )
}

module.exports = logger
