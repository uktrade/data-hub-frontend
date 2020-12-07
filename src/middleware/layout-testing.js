const { isEmpty } = require('lodash')
const logger = require('../config/logger')

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
    const {
      dit_team: { id },
    } = res.locals.user
    const [featureFlag] = layoutTestingFeature
    const [, teamId] = featureFlag.split(':')
    res.locals.isLayoutTesting = teamId === id
    if (res.locals.isLayoutTesting && isEmpty(req.query)) {
      return res.redirect(`${req.originalUrl}?layoutTesting=${queryParam}`)
    }
    next()
  }
}
