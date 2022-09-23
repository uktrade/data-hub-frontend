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

module.exports = (req, res, next) => {
  const userPermissions = get(res, 'locals.user.permissions')
  const userProfile = config.oauth.bypassSSO
    ? null
    : get(req.session, 'userProfile')
  const permittedApplications = get(userProfile, 'permitted_applications', [])
  const permittedNavItems = GLOBAL_NAV_ITEMS.filter(
    filterNonPermittedItem(userPermissions)
  )

  Object.assign(res.locals, {
    PERMITTED_APPLICATIONS: config.oauth.bypassSSO
      ? [{ key: 'datahub-crm' }]
      : permittedApplications,
    ALLOWED_APPS: permittedNavItems.reduce((apps, { headerKey }) => {
      headerKey && apps.push(headerKey)
      return apps
    }, []),
    ACTIVE_KEY: getActiveHeaderKey(req.path, permittedNavItems),

    getMessages() {
      const items = req.flash()

      for (const [key, values] of Object.entries(items)) {
        if (key.endsWith(':with-body')) {
          items[key] = values.map(convertValueToJson)
        }
      }

      return items
    },
  })

  next()
}
