const router = require('express').Router()

const { createAttendee, renderAttendees } = require('./controllers')

router.get('/', renderAttendees)

router.get('/create/:contactId', createAttendee)

module.exports = router
