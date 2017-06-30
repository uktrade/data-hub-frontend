module.exports = function auth (req, res, next) {
  const url = req.url
  const passThrough = /^\/(support|ping|login|assets)\b/.test(url) || req.session.token

  if (passThrough) {
    return next()
  }

  req.session.returnTo = req.originalUrl

  return res.redirect('/login')
}
