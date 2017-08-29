const { get } = require('lodash')
const request = require('request-promise')

const config = require('../../../config')
const { signInForm } = require('./macros')
const { buildFormWithStateAndErrors } = require('../builders')

function authenticate (username, password) {
  const options = {
    method: 'POST',
    url: config.apiRoot + config.api.authUrl,
    headers: {
      'cache-control': 'no-cache',
      'authorization': `Basic ${Buffer.from(config.api.clientId + ':' + config.api.clientSecret).toString('base64')}`,
      'content-type': 'multipart/form-data; boundary=---011000010111000001101001',
    },
    formData: {
      username: username,
      password: password,
      grant_type: 'password',
    },
    json: true,
  }

  return request(options)
}

function handleSignIn (req, res, next) {
  if (!req.body.username || !req.body.password) {
    res.locals.signInForm = buildFormWithStateAndErrors(signInForm, req.body, {
      summary: 'Please provide email and password',
    })
    return next()
  }

  return authenticate(req.body.username, req.body.password)
    .then(data => {
      req.session.token = data.access_token
      res.redirect(req.session.returnTo || '/')
    })
    .catch(error => {
      const statusCode = get(error, 'response.statusCode')

      if (statusCode === 401) {
        req.flash('error', 'Invalid email or password')
        res.redirect('/sign-in')
      } else {
        next(error)
      }
    })
}

module.exports = {
  handleSignIn,
}
