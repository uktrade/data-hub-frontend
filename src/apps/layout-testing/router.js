const router = require('express').Router()
const { isProd } = require('../../config')
const layoutTesting = require('../../middleware/layout-testing')

router.get('/', layoutTesting('testing'), (req, res, next) => {
  !isProd ? res.send(`Testing layout is ${res.locals.isLayoutTesting}`) : next()
})

module.exports = router
