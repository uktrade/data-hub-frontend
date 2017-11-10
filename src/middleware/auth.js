module.exports = function auth (req, res, next) {
  const passThrough = /^\/(healthcheck|oauth|oauth\/callback)\b/.test(req.url) || req.session.token

  if (passThrough) {
    return next()
  }

  req.session.returnTo = req.originalUrl

  return res.redirect('/oauth')
}
