const router = require('express').Router()

const { renderAttendees } = require('./controllers')

router.get('/', renderAttendees)

module.exports = router
