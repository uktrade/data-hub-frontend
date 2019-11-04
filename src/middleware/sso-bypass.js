const { get } = require('lodash')
const config = require('../config')

/**
 * If a developer wishes to bypass SSO via config and has also provided a development bearer token, then assign
 * that to token to req.session.token. Allowing SSO functionality to be bypassed.
 * @returns {Function}
 */

const ssoBypass = () => {
  return function (req, res, next) {
    const bypassSSO = get(config, 'oauth.bypassSSO')
    const oAuthDevToken = get(config, 'oauth.devToken')

    if (bypassSSO) {
      req.session.token = oAuthDevToken
    }
    next()
  }
}

module.exports = ssoBypass
