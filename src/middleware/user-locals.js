const { get } = require('lodash')

const config = require('../config')
const reporter = require('../lib/reporter')
const { filterNonPermittedItem } = require('../modules/permissions/filters')

const GLOBAL_NAV_ITEMS = require('../apps/global-nav-items')

function getActiveHeaderKey(requestPath, permittedNavItems) {
  if (requestPath.startsWith('/support')) {
    return 'datahub-support'
  } else {
    for (const { path, headerKey } of permittedNavItems) {
      if (requestPath.startsWith(path)) {
        return headerKey
      }
    }
  }
}

function convertValueToJson(value) {
  try {
    return JSON.parse(value)
  } catch (e) {
    reporter.captureException(e)
    return value
  }
}

const parseFlashMessages = (rawFlashMessages) =>
  Object.fromEntries(
    Object.entries(rawFlashMessages).map(([k, v]) => [
      k,
      k.endsWith(':with-body') ? v.map(convertValueToJson) : v,
    ])
  )

const userLocals = (req, res, next) => {
  const userPermissions = get(res, 'locals.user.permissions')
  const userProfile = config.oauth.bypassSSO
    ? null
    : get(req.session, 'userProfile')
  const permittedApplications = get(userProfile, 'permitted_applications', [])
  const permittedNavItems = GLOBAL_NAV_ITEMS.filter(
    filterNonPermittedItem(userPermissions)
  )

  res.locals.PERMITTED_APPLICATIONS = config.oauth.bypassSSO
    ? [{ key: 'datahub-crm' }]
    : permittedApplications

  res.locals.ALLOWED_APPS = permittedNavItems.reduce((apps, { headerKey }) => {
    headerKey && apps.push(headerKey)
    return apps
  }, [])

  res.locals.ACTIVE_KEY = getActiveHeaderKey(req.path, permittedNavItems)
  res.locals.flashMessages = parseFlashMessages(req.flash())

  next()
}

module.exports = {
  parseFlashMessages,
  userLocals,
}
