const { map, upperFirst } = require('lodash')

const logger = require('../config/logger')
const config = require('../config')

let webpackManifest = {}

const DEFAULT_GENERIC_PAGE_TITLE = 'DIT Data Hub'

try {
  webpackManifest = require(`${config.buildDir}/manifest.json`)
} catch (err) {
  logger.error('Manifest file is not found. Ensure assets are built.')
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
    ARCHIVED_DOCUMENT_BASE_URL: config.archivedDocumentsBaseUrl,
    GOOGLE_TAG_MANAGER_KEY: config.googleTagManagerKey,
    IS_XHR: req.xhr,
    QUERY: req.query,
    MARKET_ACCESS_URL: config.marketAccessUrl,
    FIND_EXPORTERS_URL: config.findExportersUrl,
    DATA_WORKSPACE_URL: config.dataWorkspaceUrl,

    getPageTitle() {
      const items = res.breadcrumb().map((item) => item.text)
      const title = 'title' in res.locals

      if (title) {
        let value = res.locals.title
        if (items.length === 1) {
          return [value]
        }

        items.pop()
        items.push(value)
      }

      return items.reverse().slice(0, -1)
    },

    getGenericPageTitle() {
      return extractUrlPageTitle(req)
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

  const extractUrlPageTitle = (req) => {
    let reqURL = req.originalUrl
    let isQueryStr = (reqURL.match(/\?/g) || []).length
    let urlPath =
      isQueryStr > 0
        ? reqURL.slice(1, reqURL.indexOf('?'))
        : reqURL.slice(1, reqURL.length)
    let urlPathArray = urlPath.split('/')
    let urlPathFiltered = urlPathArray.filter(
      (item) => (item.match('[^a-z0-9]') || []).length < 1
    )
    let urlPathJoin = urlPathFiltered.join('-')
    let urlPathUpperFirst = upperFirst(urlPathJoin)
    return urlPathUpperFirst + ' - ' + DEFAULT_GENERIC_PAGE_TITLE
  }
  next()
}
