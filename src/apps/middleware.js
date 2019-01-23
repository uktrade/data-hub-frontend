const { get, isEmpty, assign, intersection, isUndefined, find, startsWith, partial } = require('lodash')
const queryString = require('qs')
const { parse } = require('url')
const { LOCAL_NAV } = require('./investment-projects/constants')

const { filterNonPermittedItem } = require('../modules/permissions/filters')

function userHasPermission (routePermissions, userPermissions) {
  return intersection(routePermissions, userPermissions).length > 0
}

function setHomeBreadcrumb (text) {
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

function removeBreadcrumb (req, res, next) {
  res.removeBreadcrumb()
  next()
}

function isPermittedRoute (pathname, routes, userPermissions) {
  const routePermissions = get(routes.find((route) => {
    return pathname.endsWith(route.path)
  }), 'permissions')

  return isUndefined(routePermissions) || userHasPermission(routePermissions, userPermissions)
}

function handleRoutePermissions (routes) {
  return function handleRestrictedRoute (req, res, next) {
    const userPermissions = get(res, 'locals.user.permissions')
    const pathname = parse(req.originalUrl).pathname

    if (!isPermittedRoute(pathname, routes, userPermissions)) {
      return next({ statusCode: 403 })
    }

    return next()
  }
}

function removeDocumentsFromLHNav (isLegacyProject, documentsLabel, filterOnPermissions, item) {
  return item.label === documentsLabel && isLegacyProject
    ? false
    : filterOnPermissions(item)
}

function setLocalNav (items = []) {
  return function buildLocalNav (req, res, next) {
    const userPermissions = get(res, 'locals.user.permissions')
    const isLegacyProject = startsWith(get(res, 'locals.investment.project_code'), 'DHP')
    const documentsLabel = find(LOCAL_NAV, { 'path': 'documents' }).label
    const filterFunctions = partial(removeDocumentsFromLHNav, isLegacyProject, documentsLabel, filterNonPermittedItem(userPermissions))
    res.locals.localNavItems = items
      .filter(filterFunctions)
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
  removeBreadcrumb,
  setLocalNav,
  redirectToFirstNavItem,
  setDefaultQuery,
  handleRoutePermissions,
  isPermittedRoute,
  removeDocumentsFromLHNav,
}
