const queryString = require('query-string')
const uuid = require('uuid')

const { get, set, isUndefined } = require('lodash')

const config = require('./../../../config')
const logger = require('./../../../config/logger') // @TODO remove this once we've diagnosed the cause of the mismatches
const { reloadSession } = require('./../../lib/session-helper')
const { getAccessToken } = require('./services')

async function callbackOAuth (req, res, next) {
  const errorQueryParam = get(req.query, 'error')
  const stateQueryParam = get(req.query, 'state')
  let sessionOAuthState = get(req.session, 'oauth.state')

  if (errorQueryParam) {
    return renderHelpPage(req, res, next)
  }

  logger.error('session:', req.session) // @TODO remove this once we've diagnosed the cause of the mismatches

  if (isUndefined(sessionOAuthState)) { // an instance is not in sync with the Redis session store
    try {
      await reloadSession(req)
      sessionOAuthState = get(req.session, 'oauth.state')
    } catch (error) {
      return next(error)
    }
  }

  if (sessionOAuthState !== stateQueryParam) {
    // @TODO remove this once we've diagnosed the cause of the mismatches
    logger.error('OAuth mismatch')
    logger.error(`sessionOAuthState: ${sessionOAuthState}`)
    logger.error(`stateQueryParam: ${stateQueryParam}`)
    logger.error(`Host: ${req.hostname}`)
    logger.error(`Original URL: ${req.originalUrl}`)
    // END @TODO
    return next(Error('There has been an OAuth stateId mismatch sessionOAuthState'))
  }

  try {
    const data = await getAccessToken(req.query.code)
    set(req, 'session.token', data.access_token)
    return res.redirect(req.session.returnTo || '/')
  } catch (error) {
    return next(error)
  }
}

function redirectOAuth (req, res) {
  const stateId = uuid()
  const urlParams = {
    response_type: 'code',
    client_id: config.oauth.clientId,
    redirect_uri: config.oauth.redirectUri,
    state: stateId,
    idp: 'cirrus',
  }

  logger.error(`Host redirected from: ${req.hostname}`) // @TODO remove this once we've diagnosed the cause of the mismatches

  // As you are here you have not byPassed SSO and if the oAuthDevToken is present then pass it to the code parameter
  // that is sent to the SSO provider. When using the mock-sso app, the oAuthDevToken is simply passed through the
  // SSO journey
  const oAuthDevToken = get(config, 'oauth.devToken')

  if (oAuthDevToken) {
    set(urlParams, 'code', oAuthDevToken)
  }

  set(req.session, 'oauth.state', stateId) // used to check the callback received contains matching state param
  return res.redirect(`${config.oauth.url}?${queryString.stringify(urlParams)}`)
}

function renderHelpPage (req, res, next) {
  return res
    .render('oauth/views/help-page', {
      heading: 'You don\'t have permission to access this service',
    })
}

function signOutOAuth (req, res) {
  req.session = null
  res.clearCookie('datahub.sid')
  res.redirect(config.oauth.logoutUrl)
}

module.exports = {
  callbackOAuth,
  redirectOAuth,
  renderHelpPage,
  signOutOAuth,
}
