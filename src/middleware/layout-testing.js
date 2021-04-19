const { get, isEmpty } = require('lodash')

/**
 * Allows users with the given feature flag to trial a new layout.
 *
 * Adding this middleware to a route will set a property / global variable
 * called "isLayoutTesting" on res.locals, this variable can then be used to
 * toggle layouts/components in any njk file.
 *
 * The feature name is also added to the query string in the format
 * `?layoutTesting={feature}` for tracking via google analytics.
 *
 * Flags can be enabled on a per-user basis through Django.
 *
 * @param {String} feature - the feature to toggle layout for.
 */

module.exports = (feature) => (req, res, next) => {
  res.locals.isLayoutTesting = get(res.locals, 'user.features', []).includes(
    feature
  )

  if (res.locals.isLayoutTesting && isEmpty(req.query)) {
    return res.redirect(`${req.originalUrl}?layoutTesting=${feature}`)
  } else {
    next()
  }
}
