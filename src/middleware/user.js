const config = require('../config')
const { authorisedRequest } = require('../lib/authorised-request')

async function userMiddleware(req, res, next) {
  const token = req.session.token
  if (!token) {
    return next()
  }

  try {
    const userResponse = await authorisedRequest(
      req,
      `${config.apiRoot}/whoami/`
    )

    req.session.user = res.locals.user = userResponse
    next()
  } catch (error) {
    next(error)
  }
}

module.exports = userMiddleware
