const setRetunUrl = (req, res, next) => {
  res.locals.returnUrl = req.originalUrl
  next()
}

module.exports = setRetunUrl
