const { get } = require('lodash')
const config = require('../config')
const { filterNonPermittedItem } = require('../modules/permissions/filters')

const GLOBAL_NAV_ITEMS = require('../apps/global-nav-items')

function getActiveHeaderKey (requestPath, permittedNavItems) {
  if (requestPath.startsWith('/support')) {
    return 'datahub-support'
  } else if (requestPath === '/profile') {
    return 'datahub-profile'
  } else {
    for (const { path, headerKey } of permittedNavItems) {
      if (requestPath.startsWith(path)) {
        return headerKey
      }
    }
  }
}

module.exports = (req, res, next) => {
  const userPermissions = get(res, 'locals.user.permissions')
  const userProfile = config.oauth.bypassSSO ? null : get(req.session, 'userProfile')
  const permittedApplications = get(userProfile, 'permitted_applications', [])
  const permittedNavItems = GLOBAL_NAV_ITEMS.filter(filterNonPermittedItem(userPermissions))

  Object.assign(res.locals, {
    PERMITTED_APPLICATIONS: (config.oauth.bypassSSO ? [{ key: 'datahub-crm' }] : permittedApplications),
    ALLOWED_APPS: permittedNavItems.reduce((apps, { headerKey }) => {
      headerKey && apps.push(headerKey)
      return apps
    }, []),
    ACTIVE_KEY: getActiveHeaderKey(req.path, permittedNavItems),

    getMessages () {
      return req.flash()
    },
  })

  next()
}
