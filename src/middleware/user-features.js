const { get, isEmpty } = require('lodash')

const config = require('../config')
const { authorisedRequest } = require('../lib/authorised-request')

const setUserFeatures = async (req, res, next) => {
  if (!res.locals.userFeatures) {
    try {
      const user = await authorisedRequest(req, `${config.apiRoot}/whoami/`)
      res.locals.userFeatures = get(user, 'active_features', [])
    } catch {
      res.locals.userFeatures = undefined
    }
  }
  next()
}
/**
 * Allows users with the given feature flag to trial a new feature.
 *
 * Adding this middleware to a route will set a property / global variable
 * called "isFeatureTesting" on res.locals, this variable can then be used to
 * toggle features in any njk file.
 *
 * The feature name is also added to the query string in the format
 * `?featureTesting={feature}` for tracking via google analytics.
 *
 * Flags can be enabled on a per-user basis through Django.
 *
 * @param {String} feature - the feature to toggle layout for.
 */

const HTTP_GET = 'GET'

const checkUserFeatures = (feature) => async (req, res, next) => {
  res.locals.isFeatureTesting = res.locals.userFeatures.includes(feature)

  if (
    res.locals.isFeatureTesting &&
    !req.query.featureTesting &&
    req.method == HTTP_GET
  ) {
    res.redirect(
      `${req.originalUrl}${
        isEmpty(req.query) ? '?' : '&'
      }featureTesting=${feature}`
    )
  } else {
    next()
  }
}

module.exports = {
  checkUserFeatures,
  setUserFeatures,
}
