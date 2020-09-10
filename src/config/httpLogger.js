const morgan = require('morgan')

const logger = require('./logger')
const config = require('.')

const format = config.isDev ? 'dev' : 'combined'

const options = () => {
  let isError
  return {
    skip: (req, res) => {
      isError = res.statusCode >= 400
      return false
    },
    stream: {
      write: (msg) =>
        isError ? logger.error(msg.trim()) : logger.http(msg.trim()),
    },
  }
}

module.exports = morgan(format, options())
