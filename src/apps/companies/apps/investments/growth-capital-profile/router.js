const router = require('express').Router()

const { renderGrowthCapitalProfile } = require('./controllers')

router.get('/', renderGrowthCapitalProfile)

module.exports = router
