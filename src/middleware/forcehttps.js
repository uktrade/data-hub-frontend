const winston = require('winston')

const isDev = process.env.NODE_ENV === 'development'

module.exports = function forceHttps (req, res, next) {
  try {
    if (!isDev && req.headers['x-forwarded-proto'] && req.headers['x-forwarded-proto'].toLowerCase() === 'http') {
      const newUrl = `https://${req.headers.host}${req.url}`
      winston.info(`forcehttps: redirect to ${newUrl}`)
      res.writeHead(301, { Location: newUrl })
      res.end()
      return
    }
  } catch (error) {
    winston.error(error)
  }
  next()
}
