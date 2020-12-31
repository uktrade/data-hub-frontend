const router = require('express').Router()
const { isProd } = require('../../config')
const layoutTesting = require('../../middleware/layout-testing')

router.get('/layout', layoutTesting('testing'), (req, res, next) => {
  !isProd ? res.send(`Testing layout is ${res.locals.isLayoutTesting}`) : next()
})

router.get('/feature-flag', (req, res, next) => {
  const { featureFlag = false } = res.locals.features
  !isProd
    ? res.send(`${featureFlag ? 'Feature flag set' : 'No feature flag set'}`)
    : next()
})

module.exports = router
