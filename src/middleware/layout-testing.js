const { isEmpty } = require('lodash')

module.exports = (queryParam) => (req, res, next) => {
  const { features } = res.locals
  res.locals.isLayoutTesting = false
  const layoutTestingFeature = Object.keys(features).filter((x) =>
    x.includes('layoutTesting')
  )

  if (!isEmpty(layoutTestingFeature)) {
    if (layoutTestingFeature.length > 1) {
      throw new Error(
        'You can only have one "layoutTesting" feature running. Remove one of the features from admin.'
      )
    } else {
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
  } else {
    next()
  }
}
