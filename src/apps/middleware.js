function setHomeBreadcrumb (name) {
  return function (req, res, next) {
    if (name) {
      res.breadcrumb.add({
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
