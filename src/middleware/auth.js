module.exports = function auth(req, res, next) {
  const passThrough =
    req.session.token || /^\/(support|healthcheck|oauth)\b/.test(req.url)

  if (passThrough) {
    return next()
  }

  req.session.returnTo = req.originalUrl

  return res.redirect('/oauth')
}
