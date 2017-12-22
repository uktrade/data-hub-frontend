const { get, isEmpty, assign } = require('lodash')
const queryString = require('query-string')

const { filterNonPermittedItem } = require('./filters')

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
    const userPermissions = get(res, 'locals.user.permissions')

    res.locals.localNavItems = items
      .filter(filterNonPermittedItem(userPermissions))
      .map((item) => {
        const url = item.isExternal ? item.url : `${req.baseUrl}/${item.path}`
        return assign({}, item, {
          url,
          isActive: res.locals.CURRENT_PATH === url,
        })
      })
    next()
  }
}

function setDefaultQuery (query = {}) {
  return function handleDefaultRedirect (req, res, next) {
    if (isEmpty(req.query)) {
      return res.redirect(`${req.originalUrl}?${queryString.stringify(query)}`)
    }
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
  setDefaultQuery,
}
