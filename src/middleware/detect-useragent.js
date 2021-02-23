const useragent = require('express-useragent')

function detectUserAgent(req, res, next) {
  const source = req.headers['user-agent']
  res.locals.userAgent = useragent.parse(source)
  next()
}

module.exports = detectUserAgent
