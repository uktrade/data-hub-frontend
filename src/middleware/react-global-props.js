const config = require('../config')

module.exports = () => {
  return function reactGlobalProps(req, res, next) {
    res.locals.globalProps = {
      sentryDsn: config.sentryDsn,
      sentryEnvironment: config.sentryEnvironment,
      csrfToken: req.csrfToken(),
    }
    next()
  }
}
