const config = require('../../config')
const authorisedRequest = require('../lib/authorised-request')

module.exports = (req, res, next) => {
  const token = req.session.token
  const user = req.session.user

  if (user) {
    res.locals.user = user
    return next()
  }

  if (!token) {
    return next()
  }

  authorisedRequest(token, `${config.apiRoot}/whoami/`)
    .then((user) => {
      req.session.user = res.locals.user = user
      next()
    })
    .catch(next)
}
