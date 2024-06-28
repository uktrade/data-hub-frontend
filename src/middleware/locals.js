const { map } = require('lodash')

const logger = require('../config/logger')
const config = require('../config')

let webpackManifest = {}

try {
  webpackManifest = require(`${config.buildDir}/assets-manifest.json`)
} catch (err) {
  logger.error('Manifest file is not found. Ensure assets are built.', {
    eventType: logger.eventTypes.expressStartup,
  })
}

module.exports = function locals(req, res, next) {
  const baseUrl = `${req.encrypted ? 'https' : req.protocol}://${req.get(
    'host'
  )}`

  Object.assign(res.locals, {
    APP_VERSION: config.version,
    BASE_URL: baseUrl,
    CANONICAL_URL: baseUrl + req.path,
    ORIGINAL_URL: baseUrl + req.originalUrl,
    CURRENT_PATH: req.path,
    GOOGLE_TAG_MANAGER_KEY: config.googleTagManagerKey,
    IS_XHR: req.xhr,
    QUERY: req.query,
    MARKET_ACCESS_URL: config.marketAccessUrl,
    FIND_EXPORTERS_URL: config.findExportersUrl,
    DATA_WORKSPACE_URL: config.dataWorkspaceUrl,

    getPageTitle() {
      const items = res.breadcrumb().map((item) => item.text)
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

    getBreadcrumbs() {
      const breadcrumbs = res.breadcrumb()

      return map(breadcrumbs, ({ text, href }, i) => {
        return {
          text,
          href: i === breadcrumbs.length - 1 ? null : href,
        }
      })
    },

    getAssetPath(asset) {
      const webpackAssetPath = webpackManifest[asset]

      if (webpackAssetPath) {
        return `${baseUrl}/${webpackAssetPath}`
      }

      return `${baseUrl}/${asset}`
    },

    getLocal(key) {
      return res.locals[key]
    },
  })
  next()
}
