const { authorisedRequest } = require('../lib/authorised-request')
const config = require('../config')
const logger = require('../config/logger')

const flagUrl = `${config.apiRoot}/v3/feature-flag`

function parseFeatureData(featureData = []) {
  const features = {}

  featureData
    .filter((feature) => feature.is_active)
    .forEach((feature) => {
      features[feature.code] = true
    })

  return features
}

module.exports = async function features(req, res, next) {
  try {
    const passThrough =
      !req.session.token || /^\/(support|pingdom|oauth)\b/.test(req.url)

    if (passThrough) {
      res.locals.features = {}
      return next()
    }

    const featureData = await authorisedRequest(req, flagUrl)
    res.locals.features = parseFeatureData(featureData)
  } catch (error) {
    logger.error(`Unable to fetch feature flags: ${error}`)
    res.locals.features = {}
  }

  next()
}
