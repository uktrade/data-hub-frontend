const { get, isEmpty, assign, intersection, isUndefined } = require('lodash')
const queryString = require('qs')
const { parse } = require('url')
const path = require('path')

const { filterNonPermittedItem } = require('../modules/permissions/filters')

function userHasPermission(routePermissions, userPermissions) {
  return intersection(routePermissions, userPermissions).length > 0
}

function setHomeBreadcrumb(text) {
  return function (req, res, next) {
    if (text) {
      res.breadcrumb({
        text,
        href: req.baseUrl,
      })
    }
    next()
  }
}

function removeBreadcrumb(req, res, next) {
  res.removeBreadcrumb()
  next()
}

function isPermittedRoute(pathname, routes, userPermissions) {
  const routePermissions = get(
    routes.find((route) => {
      return pathname.endsWith(route.path)
    }),
    'permissions'
  )

  return (
    isUndefined(routePermissions) ||
    userHasPermission(routePermissions, userPermissions)
  )
}

function handleRoutePermissions(routes) {
  return function handleRestrictedRoute(req, res, next) {
    const userPermissions = get(res, 'locals.user.permissions')
    const pathname = parse(req.originalUrl).pathname

    if (!isPermittedRoute(pathname, routes, userPermissions)) {
      return next({ statusCode: 403 })
    }

    return next()
  }
}

function setLocalNav(items = [], appendBaseUrl = true) {
  return function buildLocalNav(req, res, next) {
    const userPermissions = get(res, 'locals.user.permissions')
    const { CURRENT_PATH } = res.locals

    res.locals.localNavItems = items
      .filter(filterNonPermittedItem(userPermissions))
      .map((item) => {
        const url =
          item.isExternal || !appendBaseUrl
            ? item.url
            : path.join(req.baseUrl || '', item.path)
        const isActive =
          CURRENT_PATH === url || CURRENT_PATH.startsWith(`${url}/`)
        return assign({}, item, {
          url,
          isActive,
        })
      })
    next()
  }
}

function setDefaultQuery(query = {}) {
  return function handleDefaultRedirect(req, res, next) {
    if (isEmpty(req.query)) {
      return res.redirect(`${req.originalUrl}?${queryString.stringify(query)}`)
    }
    next()
  }
}

function redirectToFirstNavItem(req, res) {
  return res.redirect(res.locals.localNavItems[0].url)
}

module.exports = {
  setHomeBreadcrumb,
  removeBreadcrumb,
  setLocalNav,
  redirectToFirstNavItem,
  setDefaultQuery,
  handleRoutePermissions,
  isPermittedRoute,
}
