const { get } = require('lodash')
const basicAuth = require('basic-auth')

const config = require('../config')

function basicAuthMiddleware (req, res, next) {
  const bypassSSO = get(config, 'oauth.bypassSSO')
  const authUser = get(config, 'basicAuth.user')
  const authPassword = get(config, 'basicAuth.password')

  if (bypassSSO && authUser && authPassword) {
    const user = basicAuth(req)

    if (!user || authUser !== user.name || authPassword !== user.pass) {
      res.setHeader('WWW-Authenticate', 'Basic realm="datahub"')
      const error = new Error('Access denied')
      error.statusCode = 401
      return next(error)
    }
  }

  next()
}

module.exports = basicAuthMiddleware
