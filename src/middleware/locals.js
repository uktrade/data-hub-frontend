const { map } = require('lodash')

const logger = require('../config/logger')
const config = require('../config')

let webpackManifest = {}
let viteManifest = {}

try {
  // console.log(`config.viteBuildDir:${config.viteBuildDir}`)
  viteManifest = require(`${config.viteBuildDir}/manifest.json`)
  // console.log(viteManifest)
  webpackManifest = require(`${config.buildDir}/assets-manifest.json`)
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
      // console.log(`loading asset ${asset}`)
      const usePreview = true
      if (usePreview) {
        if (asset == 'styles.css') {
          return `http://localhost:4173/${viteManifest['assets/stylesheets/application.scss'].file}`
        }

        if (asset == 'react-app.js') {
          return `http://localhost:4173/${viteManifest['client/index.jsx'].file}`
        }

        // if (asset == 'app.js') {
        //   return `http://localhost:4173/${viteManifest['../assets/javascripts/app.js'].file}`
        // }
      } else {
        if (asset == 'styles.css') {
          return `http://localhost:4000/assets/stylesheets/application.scss`
        }

        if (asset == 'react-app.js') {
          return `http://localhost:4000/client/index.jsx`
        }

        if (asset == 'app.js') {
          return `http://localhost:4000/assets/javascripts/app.js`
        }
      }

      const webpackAssetPath = webpackManifest[asset]

      if (webpackAssetPath) {
        console.log(
          `found webpackAssetPath asset ${webpackAssetPath} that matches ${asset}`
        )
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
