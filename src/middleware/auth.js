module.exports = function auth(req, res, next) {
  const passThrough =
    req.session.token || /^\/(healthcheck|oauth)\b/.test(req.url)

  if (passThrough) {
    return next()
  }

  req.session.returnTo = req.originalUrl

  return res.redirect('/oauth')
}
