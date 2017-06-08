/* eslint new-cap: 0 */

const router = require('express').Router()
const rp = require('request-promise')
const { get } = require('lodash')

const config = require('../config')

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

  return rp(options)
}

function login (req, res) {
  res.render('login.njk')
}

function loginToApi (req, res, next) {
  if (!req.body.username || !req.body.password) {
    req.flash('error-message', 'Invalid user id or password')
    return res.redirect('/login')
  }

  authenticate(req.body.username, req.body.password)
    .then((data) => {
      req.session.token = data.access_token
      res.redirect(req.session.returnTo || '/')
    })
    .catch((error) => {
      const statusCode = get(error, 'response.statusCode')

      if (statusCode === 401) {
        req.flash('error-message', 'Invalid user id or password')
        res.redirect('/login')
      } else {
        next(error)
      }
    })
}

function logout (req, res) {
  req.session.token = null
  req.session.user = null
  req.flash('success-message', 'Signed out')
  res.redirect('/login')
}

router.get('/', login)
router.post('/', loginToApi)
router.get('/signout', logout)

module.exports = { router }
