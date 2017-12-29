const { get } = require('lodash')

const { GLOBAL_NAV_ITEMS } = require('../apps/constants')
const logger = require('../../config/logger')
const config = require('../../config')
const { filterNonPermittedItem } = require('../apps/filters')

let webpackManifest = {}

try {
  webpackManifest = require(`${config.buildDir}/manifest.json`)
} catch (err) {
  logger.error('Manifest file is not found. Ensure assets are built.')
}

module.exports = function locals (req, res, next) {
  const baseUrl = `${(req.encrypted ? 'https' : req.protocol)}://${req.get('host')}`
  const breadcrumbItems = res.breadcrumb()
  const userPermissions = get(res, 'locals.user.permissions')

  res.locals = Object.assign({}, res.locals, {
    BASE_URL: baseUrl,
    CANONICAL_URL: baseUrl + req.path,
    ORIGINAL_URL: baseUrl + req.originalUrl,
    CURRENT_PATH: req.path,
    ARCHIVED_DOCUMENT_BASE_URL: config.archivedDocumentsBaseUrl,
    GOOGLE_TAG_MANAGER_KEY: config.googleTagManagerKey,
    BREADCRUMBS: breadcrumbItems,
    IS_XHR: req.xhr,
    QUERY: req.query,
    GLOBAL_NAV_ITEMS: GLOBAL_NAV_ITEMS
      .filter(filterNonPermittedItem(userPermissions))
      .map(navItem => {
        const { path: url, label } = navItem
        return {
          label,
          url,
          isActive: req.path.startsWith(url),
        }
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
