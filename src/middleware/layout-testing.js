const { isEmpty, get } = require('lodash')
const logger = require('../config/logger')

/**
 * Allows a specific group of users to test a new layout. You need to set a feature flag in Django in the following
 * format: layoutTesting:1234 where 1234 is an id of a specific team. Once set all users that fall into that team will
 * be exposed to the new layout.
 * @param {String} queryParam - Sets a query param in the url. "Foo" results in ?layoutTesting=foo This is for tracking
 * via google analytics. Adding this middleware to a route will set a property/global variable called "isLayoutTesting"
 * on res.locals, this variable can then be used to toggle layouts/components in any njk file.
 */

module.exports = (queryParam) => (req, res, next) => {
  const { features } = res.locals
  res.locals.isLayoutTesting = false
  const layoutTestingFeature = Object.keys(features).filter((feature) =>
    feature.includes('layoutTesting')
  )

  layoutTestingFeature.length > 1 &&
    logger.warn(
      'You can ONLY have one "layoutTesting" feature flag set at a time otherwise only the first one in the list will be used. Deactivate or remove one from Django admin.'
    )

  if (!isEmpty(layoutTestingFeature)) {
    const userTeamId = get(res.locals.user.dit_team, 'id')
    const [featureFlag] = layoutTestingFeature
    const [, featureTeamId] = featureFlag.split(':')
    res.locals.isLayoutTesting = featureTeamId === userTeamId
    if (res.locals.isLayoutTesting && isEmpty(req.query)) {
      return res.redirect(`${req.originalUrl}?layoutTesting=${queryParam}`)
    }
    next()
  } else {
    next()
  }
}
