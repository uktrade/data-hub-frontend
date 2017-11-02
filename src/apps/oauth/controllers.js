const request = require('request-promise')
const queryString = require('query-string')
const uuid = require('uuid')
const { set } = require('lodash')

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

function callbackOAuth (req, res, next) {
  const errorParam = req.query.error

  // TODO create error page with information for users
  if (errorParam) {
    return next(Error(errorParam))
  }

  if (req.session.oauth.stateId !== req.query.state) {
    return next(Error('state sent from OAuth does not match session stateId'))
  }

  return getAccessToken(req.query.code)
    .then((data) => {
      req.session.token = data.access_token
      return res.redirect(req.session.returnTo || '/')
    })
    .catch((err) => {
      return next(err)
    })
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

  set(req.session, 'oauth.stateId', stateId) // used to check the callback received contains the same state id
  return res.redirect(`${config.oauth.url}?${queryString.stringify(url)}`)
}

module.exports = {
  callbackOAuth,
  redirectOAuth,
}
