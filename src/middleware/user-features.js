const { get } = require('lodash')

const config = require('../config')
const { authorisedRequest } = require('../lib/authorised-request')

/**
 * Allows users with the given feature flag to trial a new feature.
 *
 * Adding this middleware to a route will set a property / global variable
 * called "isFeatureTesting" on res.locals, this variable can then be used to
 * toggle features in any njk file.
 *
 * The feature name is also pushed to the Google Tag Manager data layer
 * for tracking via Google Analytics.
 *
 * Flags can be enabled on a per-user basis through Django.
 *
 * @param {String} feature - the feature to toggle layout for.
 */

const HTTP_GET = 'GET'

module.exports = (feature) => async (req, res, next) => {
  if (!res.locals.userFeatures) {
    const user = await authorisedRequest(req, `${config.apiRoot}/whoami/`)
    res.locals.userFeatures = get(user, 'active_features', [])
  }

  res.locals.isFeatureTesting = res.locals.userFeatures.includes(feature)

  if (res.locals.isFeatureTesting && req.method == HTTP_GET) {
    res.locals.userFeatureGTMEvent = {
      name: feature,
      event: 'featureFlag',
    }
  }

  next()
}
