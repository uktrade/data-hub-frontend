const PUBLICLY_ACCESSIBLE_API_ENDPOINTS = [
  '/api-proxy/v4/export-win/review',
  '/api-proxy/v4/metadata/without-our-support',
  '/api-proxy/v4/metadata/rating',
  '/api-proxy/v4/metadata/experience',
  '/api-proxy/v4/metadata/marketing-source',
]

const REGEX = new RegExp(PUBLICLY_ACCESSIBLE_API_ENDPOINTS.join('|'))

module.exports = function auth(req, res, next) {
  const passThrough = req.session.token || /^\/(pingdom|oauth)\b/.test(req.url)

  if (passThrough) {
    return next()
  }

  if (REGEX.test(req.url)) {
    return next()
  }

  req.session.returnTo = req.originalUrl

  return res.redirect('/oauth')
}
