const path = require('path')

function localNavMiddleware (items = []) {
  return function buildLocalNav (req, res, next) {
    res.locals.localNavItems = items.map(item => {
      const url = path.resolve(res.locals.CURRENT_PATH, item.path)
      return Object.assign(item, {
        url,
        isActive: res.locals.CURRENT_PATH === url,
      })
    })
    next()
  }
}

module.exports = localNavMiddleware
