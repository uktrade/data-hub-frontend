const logger = require('../../config/logger')
const config = require('../../config')

let webpackManifest = {}
try {
  webpackManifest = require('../../build/manifest.json')
} catch (err) {
  logger.error('Manifest file is not found. Ensure assets are built.')
}

module.exports = {
  serviceTitle: 'Data Hub',
  projectPhase: 'alpha',
  description: 'Data Hub is a customer relationship, project management and analytical tool for Department for International Trade.',
  feedbackLink: '/support/bug',

  getAssetPath (asset) {
    const assetsUrl = config.assetsHost || this.ctx.BASE_URL || '/'

    const webpackAssetPath = webpackManifest[asset]

    if (webpackAssetPath) {
      return `${assetsUrl}/${webpackAssetPath}`
    }

    return `${assetsUrl}/${asset}`
  },
}
