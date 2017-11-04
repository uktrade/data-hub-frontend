const request = require('request-promise')
const queryString = require('query-string')
const uuid = require('uuid')
const { get, set } = require('lodash')

const config = require('./../../../config')

function getAccessToken (oauthCode) {
  const options = {
    method: 'POST',
    url: config.oauth.tokenFetchUrl,
    formData: {
      code: oauthCode,
      grant_type: 'authorization_code',
      client_id: config.oauth.clientId,
      client_secret: config.oauth.clientSecret,
      redirect_uri: config.oauth.redirectUri,
    },
    json: true,
  }

  return request(options)
}

async function callbackOAuth (req, res, next) {
  const errorQueryParam = get(req.query, 'error')
  const stateQueryParam = get(req.query, 'state')
  const sessionOAuthState = get(req.session, 'oauth.state')

  if (errorQueryParam) {
    return renderHelpPage(req, res, next, errorQueryParam)
  }

  if (sessionOAuthState !== stateQueryParam) {
    return renderHelpPage(req, res, next, 'state_mismatch')
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
  const url = {
    response_type: 'code',
    client_id: config.oauth.clientId,
    redirect_uri: config.oauth.redirectUri,
    state: stateId,
    idp: 'cirrus',
  }

  set(req.session, 'oauth.state', stateId) // used to check the callback received contains matching state param
  return res.redirect(`${config.oauth.url}?${queryString.stringify(url)}`)
}

function renderHelpPage (req, res, next, errorCode) {
  const errorMessages = {
    'access-denied': 'Access denied',
    invalid_scope: 'Invalid scope',
    state_mismatch: 'State mismatch',
  }

  return res
    .breadcrumb('Contact Live Services')
    .render('oauth/views/help-page', {
      heading: 'Contact Live Services',
      errorCode,
      errorMessage: errorMessages[errorCode],
    })
}

module.exports = {
  callbackOAuth,
  redirectOAuth,
  renderHelpPage,
}
