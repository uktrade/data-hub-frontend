const winston = require('winston')
const { genCSRF } = require('../lib/controllerutils')

module.exports = (req, res, next) => {
  if (req.method !== 'POST' || req.url === '/login') {
    res.locals.csrfToken = genCSRF(req, res)
    return next()
  }

  try {
    const sessionCsrf = req.session.csrfToken
    let requestCsrf

    // Look for the csrf token first in the form body, if not then the http headers
    if (req.body && req.body._csrf_token) {
      requestCsrf = req.body._csrf_token
    } else {
      requestCsrf = req.get('x-csrf-token')
    }

    // Not matter what, reset the token now it has been used.
    req.session.csrfToken = null

    if (!requestCsrf || !sessionCsrf || requestCsrf !== sessionCsrf) {
      winston.debug('Invalid token:', { requestCsrf, sessionCsrf })
      throw Error('Invalid token')
    }
  } catch (e) {
    winston.error(e)
    return res.sendStatus(400)
  }

  winston.debug('csrf:end')
  delete req.body._csrf_token
  res.locals.csrfToken = genCSRF(req, res)
  return next()
}
