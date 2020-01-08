// istanbul ignore next: Covered by functional tests
const setReturnUrl = (req, res, next) => {
  res.locals.returnUrl = req.originalUrl
  next()
}

module.exports = setReturnUrl
