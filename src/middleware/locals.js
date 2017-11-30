const logger = require('../../config/logger')
const config = require('../../config')

let webpackManifest = {}
try {
  webpackManifest = require(`${config.buildDir}/manifest.json`)
} catch (err) {
  logger.error('Manifest file is not found. Ensure assets are built.')
}

const globalNavItems = [
  { path: '/companies', label: 'Companies' },
  { path: '/contacts', label: 'Contacts' },
  { path: '/events', label: 'Events' },
  { path: '/interactions', label: 'Interactions and services' },
  { path: '/investment-projects', label: 'Investment projects' },
  { path: '/omis', label: 'Orders (OMIS)' },
  { path: config.performanceDashboardsUrl, label: 'MI dashboards' },
]

module.exports = function locals (req, res, next) {
  const baseUrl = `${(req.encrypted ? 'https' : req.protocol)}://${req.get('host')}`
  const breadcrumbItems = res.breadcrumb()

  res.locals = Object.assign({}, res.locals, {
    BASE_URL: baseUrl,
    ORIGINAL_URL: baseUrl + req.originalUrl,
    CURRENT_PATH: req.path,
    ARCHIVED_DOCUMENT_BASE_URL: config.archivedDocumentsBaseUrl,
    GOOGLE_TAG_MANAGER_KEY: config.googleTagManagerKey,
    BREADCRUMBS: breadcrumbItems,
    IS_XHR: req.xhr,
    QUERY: req.query,
    GLOBAL_NAV_ITEMS: globalNavItems.map(globalNavItem => {
      const url = globalNavItem.path

      return Object.assign(globalNavItem, {
        url,
        isActive: req.path.startsWith(url),
      })
    }),

    getMessages () {
      return req.flash()
    },

    getPageTitle () {
      const items = breadcrumbItems.map(item => item.name)
      const title = res.locals.title

      if (title) {
        if (items.length === 1) {
          return [title]
        }

        items.pop()
        items.push(title)
      }

      return items.reverse().slice(0, -1)
    },

    getAssetPath (asset) {
      const assetsUrl = config.assetsHost || baseUrl
      const webpackAssetPath = webpackManifest[asset]

      if (webpackAssetPath) {
        return `${assetsUrl}/${webpackAssetPath}`
      }

      return `${assetsUrl}/${asset}`
    },

    getLocal (key) {
      return res.locals[key]
    },

    translate (key) {
      return req.translate(key)
    },
  })
  next()
}
