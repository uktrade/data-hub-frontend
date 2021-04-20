const { get, isEmpty } = require('lodash')

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

module.exports = (feature) => (req, res, next) => {
  const userFeatures = get(res.locals, 'user.active_features', [])
  res.locals.isFeatureTesting = userFeatures.includes(feature)

  if (res.locals.isFeatureTesting && isEmpty(req.query)) {
    return res.redirect(`${req.originalUrl}?featureTesting=${feature}`)
  } else {
    next()
  }
}
