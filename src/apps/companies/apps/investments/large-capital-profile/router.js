const router = require('express').Router()

const { renderLargeCapitalProfile } = require('./controllers')
router.get('/', renderLargeCapitalProfile)

module.exports = router
