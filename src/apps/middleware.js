function addBaseBreadcrumb (name) {
  return function (req, res, next) {
    if (name) {
      req.breadcrumbs({
        name,
        url: req.baseUrl,
      })
    }
    next()
  }
}

module.exports = {
  addBaseBreadcrumb,
}
