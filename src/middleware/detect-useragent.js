const useragent = require('express-useragent')

// TODO: Do we still need this???
function detectUserAgent(req, res, next) {
  const source = req.headers['user-agent']
  res.locals.userAgent = useragent.parse(source)
  next()
}

module.exports = detectUserAgent
