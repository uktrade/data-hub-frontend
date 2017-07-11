function setHomeBreadcrumb (name) {
  return function (req, res, next) {
    if (name) {
      res.breadcrumb({
        name,
        url: req.baseUrl,
      })
    }
    next()
  }
}

module.exports = {
  setHomeBreadcrumb,
}
