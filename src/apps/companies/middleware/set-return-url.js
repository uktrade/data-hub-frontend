// istanbul ignore next: Covered by functional tests
const setRetunUrl = (req, res, next) => {
  res.locals.returnUrl = req.originalUrl
  next()
}

module.exports = setRetunUrl
