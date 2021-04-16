const { isEmpty, get } = require('lodash')

/**
 * Allows a specific group of users to test a new layout. You need to set a feature flag in Django in the following
 * format: layoutTesting:1234 where 1234 is an id of a specific team. Once set all users that fall into that team will
 * be exposed to the new layout.
 *
 * Features can also be enabled on a per-user basis through Django.
 *
 * @param {String} queryParam - Sets a query param in the url. "Foo" results in ?layoutTesting=foo This is for tracking
 * via google analytics. Adding this middleware to a route will set a property/global variable called "isLayoutTesting"
 * on res.locals, this variable can then be used to toggle layouts/components in any njk file.
 */

module.exports = (queryParam) => (req, res, next) => {
  const userTeamId = get(res.locals.user.dit_team, 'id')

  res.locals.isLayoutTesting =
    res.locals.user.features.includes('personalised-dashboard') ||
    !!Object.keys(res.locals.features).filter(
      (feature) =>
        feature.includes('layoutTesting') &&
        feature.split(':')[1] === userTeamId
    ).length

  if (res.locals.isLayoutTesting && isEmpty(req.query)) {
    return res.redirect(`${req.originalUrl}?layoutTesting=${queryParam}`)
  } else {
    next()
  }
}
