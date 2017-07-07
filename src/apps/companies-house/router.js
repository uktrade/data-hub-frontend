const router = require('express').Router()

const { getDetails } = require('./controllers')

router.get('/:id/details', getDetails)

module.exports = router
