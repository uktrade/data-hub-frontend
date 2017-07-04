const rp = require('request-promise')
const { get } = require('lodash')

const config = require('../../../../config')

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

function getHandler (req, res) {
  if (req.session.user) {
    return res.redirect('/')
  }

  res.render('auth/views/sign-in', {
    title: 'Sign in',
  })
}

function postHandler (req, res, next) {
  if (!req.body.username || !req.body.password) {
    res.locals.form = Object.assign({}, res.locals.form, {
      errors: {
        summary: 'Please provide email and password',
      },
    })
    return getHandler(req, res)
  }

  authenticate(req.body.username, req.body.password)
    .then((data) => {
      req.session.token = data.access_token
      res.redirect(req.session.returnTo || '/')
    })
    .catch((error) => {
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
  getHandler,
  postHandler,
}
