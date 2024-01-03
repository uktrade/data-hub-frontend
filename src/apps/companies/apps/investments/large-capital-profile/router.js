const router = require('express').Router()

const { renderProfile } = require('./controllers')

router.get('/', renderProfile)

module.exports = router
