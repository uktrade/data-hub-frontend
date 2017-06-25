const logger = require('../../config/logger')
const pjson = require('../../package.json')
const config = require('../../config')

const startTime = new Date().getTime()

let webpackManifest = {}
try {
  webpackManifest = require(`${config.buildDir}/manifest.json`)
} catch (err) {
  logger.error('Manifest file is not found. Ensure assets are built.')
}

module.exports = function locals (req, res, next) {
  logger.debug('locals:start')
  const baseUrl = `${(req.encrypted ? 'https' : req.protocol)}://${req.get('host')}`

  res.locals = Object.assign({}, res.locals, {
    releaseVersion: pjson.version,
    startTime: startTime,
    referer: req.headers.referer,
    env: config.env,
    googleTagManagerKey: config.googleTagManagerKey,
    query: req.query,
    currentPath: req.path,
    BASE_URL: baseUrl,
    CANONICAL_URL: baseUrl + req.originalUrl,

    getAssetPath (asset) {
      const assetsUrl = config.assetsHost || baseUrl
      const webpackAssetPath = webpackManifest[asset]

      if (webpackAssetPath) {
        return `${assetsUrl}/${webpackAssetPath}`
      }

      return `${assetsUrl}/${asset}`
    },
  })

  logger.debug('locals:end')
  next()
}
