const { get } = require('lodash')
const config = require('../../config')

/**
 * If a development bearer token has been provided then assign that to req.session.token
 * so SSO functionality can be bypassed for developers.
 * @returns {Function}
 */

const ssoBypass = () => {
  return function (req, res, next) {
    const token = get(config, 'oauth.token')

    if (token) {
      req.session.token = token
    }
    next()
  }
}

module.exports = ssoBypass
