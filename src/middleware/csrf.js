const winston = require('winston')

module.exports = (req, res, next) => {
  winston.debug('csrf:start')

  if (req.method !== 'POST' || req.url === '/login') {
    winston.debug('csrf:bypass')
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
  return next()
}
