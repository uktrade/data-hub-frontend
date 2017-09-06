module.exports = function auth (req, res, next) {
  const url = req.url
  const passThrough = /^\/(support|healthcheck|sign-in|sign-out)\b/.test(url) || req.session.token

  if (passThrough) {
    return next()
  }

  req.session.returnTo = req.originalUrl

  return res.redirect('/sign-in')
}
