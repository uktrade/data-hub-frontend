const path = require('path')

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

function setLocalNav (items = []) {
  return function buildLocalNav (req, res, next) {
    res.locals.localNavItems = items.map(item => {
      const url = path.resolve(req.baseUrl, item.path)
      return Object.assign(item, {
        url,
        isActive: res.locals.CURRENT_PATH === url,
      })
    })
    next()
  }
}

function redirectToFirstNavItem (req, res) {
  return res.redirect(res.locals.localNavItems[0].url)
}

module.exports = {
  setHomeBreadcrumb,
  setLocalNav,
  redirectToFirstNavItem,
}
