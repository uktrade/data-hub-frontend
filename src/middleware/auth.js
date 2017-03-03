const winston = require('winston')

module.exports = function auth (req, res, next) {
  winston.debug('auth:start')

  if (!req.url.startsWith('/ping.xml') && !req.url.startsWith('/support') && req.url !== '/login' && req.url !== '/error' && !req.session.token) {
    winston.debug('auth:redirect login')
    res.redirect('/login')
    return
  }

  winston.debug('auth:end')
  next()
}
