const { get } = require('lodash')

const config = require('../config')
const { authorisedRequest } = require('../lib/authorised-request')

async function userMiddleware(req, res, next) {
  const token = req.session.token
  const userSession = req.session.user

  if (userSession) {
    res.locals.user = userSession
    return next()
  }

  if (!token) {
    return next()
  }

  try {
    const userResponse = await authorisedRequest(
      req,
      `${config.apiRoot}/whoami/`
    )

    const userId = get(req.session, 'userProfile.user_id')

    const user = {
      ...userResponse,
      userId,
    }

    req.session.user = res.locals.user = user

    next()
  } catch (error) {
    next(error)
  }
}

module.exports = userMiddleware
